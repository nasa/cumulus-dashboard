/* eslint-disable node/no-deprecated-api */
/* eslint-disable lodash/prefer-noop */
require('@babel/register');

require.extensions['.css'] = () => {};
require.extensions['.jpg'] = () => {};
