/* eslint-disable node/no-deprecated-api */
/* eslint-disable lodash/prefer-noop */
import babelRegister from '@babel/register';

babelRegister(
  {
    extensions: ['.css', '.jpg']
  }
);
