import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import path from 'path';
import { fileURLToPath } from 'url';

// mimic CommonJS variables for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  resolvePluginsRelativeTo: __dirname,
  //recommendedConfig: js.configs.recommended,
});

export default [
  ...compat.plugins(
    'react',
    'react-hooks',
    'node',
    //'standard',
    //'import',
    //'lodash',
  ),
  ...compat.extends(
    //'airbnb',
    'plugin:eslint-comments/recommended',
    'plugin:import/recommended',
    'plugin:lodash/recommended',
    'plugin:jsx-a11y/recommended',
  ),
  ...compat.config({
    root: false,
    // extend the configs for imported plugins
    env: {
      es6: true,
      browser: true,
      mocha: true,
      node: true,
    },
    parser: '@babel/eslint-parser',
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module', // to handle esm
      ecmaFeatures: {
        jsx: true,
      },
      allowImportExportEverywhere: true,
      requireConfigFile: true,
      babelOptions: {
        babelrc: false,
        configFile: './babel.config.json',
      },
    },
    rules: {
      // Rule Meaning: 0 - rule off, 1 - rule on as a warning, 2 - rule on as an error (exit code is 1 when triggered)
      'no-unused-vars': 1,
      'no-undef': 1,
      'comma-dangle': [2, 'only-multiline'],
      'space-before-function-paren': [
        1,
        { anonymous: 'ignore', named: 'ignore', asyncArrow: 'ignore' },
      ],
      semi: [2, 'always'],
      'no-extra-semi': 2,
      'semi-spacing': [2, { before: false, after: true }],
      'new-cap': [2, { properties: false }],
      'eslint-comments/no-unused-disable': 1,
      'eslint-comments/disable-enable-pair': [2, { allowWholeFile: true }],
      'import/no-extraneous-dependencies': 0,
      'import/newline-after-import': 0,
      'import/no-named-as-default': 0,
      'import/no-unresolved': 2, // to handle cjs node modules to esm
      'import/no-commonjs': 2, // to handle cjs node modules to esm
      'import/extensions': [1, 'ignorePackages'], // to handle cjs node modules to esm
      'lodash/import-scope': [2, 'method'],
      'lodash/prefer-constant': 0,
      'lodash/prefer-lodash-method': 0,
      'lodash/prefer-lodash-typecheck': 0,
      'no-param-reassign': [2, { props: false }],
      'class-methods-use-this': 0,
      'consistent-return': 0,
      'no-console': 0,
      'max-len': [
        2,
        {
          code: 120,
          ignorePattern: 'https?:|JSON\\.parse|[Uu]rl =',
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
        },
      ],
      'no-plusplus': [2, { allowForLoopAfterthoughts: true }],
      'jsx-a11y/click-events-have-key-events': 0,
      'node/no-deprecated-api': 2,
      'react/jsx-no-duplicate-props': 2,
      'react/jsx-no-undef': 1,
      'react/jsx-uses-react': 2,
      'react/jsx-uses-vars': 2,
      'react/no-danger': 0,
      'react/no-deprecated': 2,
      'react/no-did-mount-set-state': 0,
      'react/no-did-update-set-state': 0,
      'react/no-direct-mutation-state': 2,
      'react/no-is-mounted': 2,
      'react/no-unknown-property': 2,
      'react/prop-types': 2,
      'react/react-in-jsx-scope': 2,
      'react-hooks/rules-of-hooks': 2,
      'react-hooks/exhaustive-deps': 1,
    },
    globals: {
      cy: true,
      Cypress: true,
      expect: true,
    },
    // Define React version settings
    settings: {
      react: {
        pragma: 'React',
        version: '16.10.2',
      },
    },
  }),
];
