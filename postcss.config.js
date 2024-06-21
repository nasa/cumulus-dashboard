import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';

export default {
  plugins: [
    autoprefixer({
      overrideBrowserslist: ['> 0.2%', 'last 2 versions']
    }),
    cssnano
  ]
};
