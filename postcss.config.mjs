const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

module.exports = {
  plugins: [
    autoprefixer({
      overrideBrowserslist: ['> 0.2%', 'last 2 versions']
    }),
    cssnano
  ]
};
