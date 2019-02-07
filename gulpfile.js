'use strict';

const path = require('path');
const fs = require('fs');
const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const uglify = require('gulp-uglify-es').default;
const gutil = require('gulp-util');
const del = require('del');
const browserSync = require('browser-sync');
const reload = browserSync.reload;
const watchify = require('watchify');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const sourcemaps = require('gulp-sourcemaps');
const rev = require('gulp-rev');
const revReplace = require('gulp-rev-replace');
const SassString = require('node-sass').types.String;
const notifier = require('node-notifier');
const config = require('./app/scripts/config');

// /////////////////////////////////////////////////////////////////////////////
// --------------------------- Variables -------------------------------------//
// ---------------------------------------------------------------------------//

// The package.json
let pkg;

let prodBuild = false;

// /////////////////////////////////////////////////////////////////////////////
// ------------------------- Helper functions --------------------------------//
// ---------------------------------------------------------------------------//

function ensureConfigExists () {
  try {
    fs.statSync(path.join(__dirname, 'app', 'scripts', 'config', 'config.js'));
  } catch (e) {
    throw new Error('create a config file at app/scripts/config/config.js by copying app/scripts/config/example.config.js');
  }
}

function readPackage () {
  pkg = JSON.parse(fs.readFileSync('package.json'));
}

ensureConfigExists();
readPackage();

// /////////////////////////////////////////////////////////////////////////////
// ------------------------- Browserify tasks --------------------------------//
// ------------------- (Not to be called directly) ---------------------------//
// ---------------------------------------------------------------------------//

// Compiles the user's script files to bundle.js.
// When including the file in the index.html we need to refer to bundle.js not
// main.js
gulp.task('javascript', function () {
  let bundler = browserify({
    entries: ['./app/scripts/main.js'],
    debug: true,
    cache: {},
    packageCache: {},
    fullPaths: true
  });

  if (!prodBuild) {
    bundler = watchify(bundler, { poll: true });
    bundler
      .on('log', gutil.log)
      .on('update', bundleScripts);
  }

  function bundleScripts () {
    if (pkg.dependencies) {
      bundler.external(Object.keys(pkg.dependencies));
    }
    return bundler.bundle()
      .on('error', function (e) {
        notifier.notify({
          title: 'Oops! Browserify errored:',
          message: e.message
        });
        console.log('Javascript error:', e);
        if (prodBuild) {
          process.exit(1);
        }
        // Allows the watch to continue.
        this.emit('end');
      })
      .pipe(source('bundle.js'))
      .pipe(buffer())
      // Source maps.
      .pipe(sourcemaps.init({loadMaps: true}))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('.tmp/scripts'))
      .pipe(reload({stream: true}));
  }

  return bundleScripts();
});

// Vendor scripts. Basically all the dependencies in the package.json.
// Therefore be careful and keep the dependencies clean.
gulp.task('vendorScripts', function () {
  // Ensure package is updated.
  readPackage();
  var vb = browserify({
    debug: true,
    require: pkg.dependencies ? Object.keys(pkg.dependencies) : []
  });

  // Ignore unnecessary web-incompatible package
  vb.ignore('fs-extra');

  return vb.bundle()
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('vendor.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('.tmp/scripts/'))
    .pipe(reload({stream: true}));
});

// //////////////////////////////////////////////////////////////////////////////
// --------------------------- Helper tasks -----------------------------------//
// ----------------------------------------------------------------------------//

const logBuildSize = () => {
  return gulp.src('dist/**/*')
    .pipe($.size({title: 'build', gzip: true}));
};

const compileBuild = (done) => {
  return gulp.series(
    gulp.parallel('html', 'images', 'fonts', 'extras'),
    logBuildSize,
  )(done);
};

const doBuild = (done) => {
  return gulp.series('vendorScripts', 'javascript', compileBuild)(done);
};

gulp.task('build', gulp.parallel(doBuild));

gulp.task('styles', function () {
  return gulp.src('app/styles/main.scss')
    .pipe($.plumber(function (e) {
      notifier.notify({
        title: 'Oops! Sass errored:',
        message: e.message
      });
      console.log('Sass error:', e.toString());
      if (prodBuild) {
        process.exit(1);
      }
      // Allows the watch to continue.
      this.emit('end');
    }))
    .pipe($.sourcemaps.init())
    .pipe($.sass({
      outputStyle: 'expanded',
      precision: 10,
      functions: {
        'urlencode($url)': function (url) {
          var v = new SassString();
          v.setValue(encodeURIComponent(url.getValue()));
          return v;
        }
      },
      includePaths: ['.'].concat(require('node-bourbon').includePaths)
    }))
    .pipe($.preprocess({context: { ASSETS_PATH: config.graphicsPath }}))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('.tmp/styles'))
    .pipe(reload({stream: true}));
});

gulp.task('html', gulp.series('styles', function () {
  return gulp.src('app/*.html')
    .pipe($.useref({searchPath: ['.tmp', 'app', '.']}))
    .pipe($.if('*.js', uglify()))
    .pipe($.if('*.css', $.csso()))
    .pipe($.if(/\.(css|js)$/, rev()))
    .pipe(revReplace())
    .pipe(gulp.dest('dist'));
}));

gulp.task('images', function () {
  return gulp.src('app/graphics/**/*')
    .pipe($.cache($.imagemin([
      $.imagemin.gifsicle({interlaced: true}),
      $.imagemin.jpegtran({progressive: true}),
      $.imagemin.optipng({optimizationLevel: 5}),
      // don't remove IDs from SVGs, they are often used
      // as hooks for embedding and styling
      $.imagemin.svgo({plugins: [{cleanupIDs: false}]})
    ])))
    .pipe(gulp.dest('dist/graphics'));
});

gulp.task('fonts', function () {
  return gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('.tmp/fonts'))
    .pipe(gulp.dest('dist/fonts'));
});

gulp.task('extras', function () {
  return gulp.src([
    'app/**/*',
    '!app/*.html',
    '!app/graphics/**',
    '!app/vendor/**',
    '!app/styles/**',
    '!app/scripts/**'
  ], {
    dot: true
  }).pipe(gulp.dest('dist'));
});

// /////////////////////////////////////////////////////////////////////////////
// ------------------------- Callable tasks ----------------------------------//
// ---------------------------------------------------------------------------//

gulp.task('clean', function () {
  return del(['.tmp', 'dist'])
    .then(function () {
      $.cache.clearAll();
    });
});

gulp.task('serve', gulp.series('vendorScripts', 'javascript', 'styles', 'fonts', function () {
  browserSync({
    port: process.env.PORT || 3000,
    server: {
      baseDir: ['.tmp', 'app'],
      routes: {
        '/node_modules': './node_modules'
      }
    }
  });

  // watch for changes
  gulp.watch([
    'app/*.html',
    'app/graphics/**/*',
    '.tmp/fonts/**/*'
  ]).on('change', reload);

  gulp.watch('app/styles/**/*.scss', gulp.series('styles'));
  gulp.watch('app/fonts/**/*', gulp.series('fonts'));
  gulp.watch('package.json', gulp.series('vendorScripts'));
}));

const doProdBuild = (done) => {
  prodBuild = true;
  return gulp.series(doBuild)(done);
};

gulp.task('default', gulp.series('clean', doProdBuild));
