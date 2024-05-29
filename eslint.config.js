// New FlatConfig ESLint
import js from '@eslint/js';
import globals from 'globals';
import airbnbBase from 'eslint-config-airbnb-base';
import standard from 'eslint-config-standard';
import eslintComments from 'eslint-plugin-eslint-comments';
import importPlugin from 'eslint-plugin-import';
import lodash from 'eslint-plugin-lodash';
import jsxAlly from 'eslint-plugin-jsx-a11y';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import babelParser from '@babel/eslint-parser';

export default [
  {
    files: ['**/*.js'],
    rules: js.configs.recommended.rules,
  },
  // global ignores that replace .eslintignore for flat config
  {
    ignores: ['test/**', 'dist/**', 'docker/**'],
  },
  // declare imported configs
  {
    plugins: {
      'airbnb-base': airbnbBase,
      'standard': standard,
      'eslint-comments': eslintComments,
      'import': importPlugin,
      'lodash': lodash,
      'jsx-a11y': jsxAlly,
      'react': react,
      'react-hooks': reactHooks,
    },
  },
  // global rules
  {
    files: ['**/*.js', '**/*.jsx'],
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: {
          jsx: true,
        },
        allowImportExportEverywhere: true,
        sourceType: 'module', // to handle esm
        requireConfigFile: false,
        babelOptions: {
          configFile: true,
        },
      },
      globals: {
        ...globals.browser,
        cy: true,
        Cypress: true,
        expect: true,
      },
    },
    rules: {
      'comma-dangle': ['error', 'only-multiline'],
      'space-before-function-paren': [
        'warn',
        { anonymous: 'ignore', named: 'ignore', asyncArrow: 'ignore' },
      ],
      semi: ['error', 'always'],
      'no-extra-semi': 2,
      'semi-spacing': [2, { before: false, after: true }],
      'new-cap': [2, { properties: false }],
      'react/jsx-no-duplicate-props': 2,
      'react/jsx-no-undef': 2,
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
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'eslint-comments/no-unused-disable': 'warn',
      'eslint-comments/disable-enable-pair': [
        'error',
        { allowWholeFile: true },
      ],
      'import/no-extraneous-dependencies': 'off',
      'import/newline-after-import': 'off',
      'import/no-named-as-default': 'off',
      'import/no-unresolved': 2, // to handle cjs node modules to esm
      'import/no-commonjs': 2, // to handle cjs node modules to esm
      'import/extensions': ['error', 'ignorePackages'], // to handle cjs node modules to esm
      'lodash/import-scope': ['error', 'method'],
      'lodash/prefer-constant': 'off',
      'lodash/prefer-lodash-method': 'off',
      'lodash/prefer-lodash-typecheck': 'off',
      'no-param-reassign': ['error', { props: false }],
      'class-methods-use-this': 'off',
      'consistent-return': 'off',
      'no-console': 'off',
      'max-len': [
        2,
        {
          code: 120,
          ignorePattern: 'https?:|JSON\\.parse|[Uu]rl =',
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
        },
      ],
      'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
      'jsx-a11y/click-events-have-key-events': 'off'
    },
    // Define React version settings
    settings: {
      react: {
        pragma: 'React',
        version: '17.0.2',
      },
    },
  },
];
