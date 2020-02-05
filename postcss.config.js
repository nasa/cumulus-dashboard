const autoprefixer = require('autoprefixer');
const precss = require('precss');
const cssnano = require('cssnano');

module.exports = {
  plugins: [
    precss,
    autoprefixer({
      overrideBrowserslist: ['> 0.2%', 'last 2 versions']
    }),
    cssnano
  ]
};
