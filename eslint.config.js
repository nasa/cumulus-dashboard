// New FlatConfig ESLint
import js from '@eslint/js';
import globals from 'globals';
import airbnbBase from 'eslint-config-airbnb-base';
import standard from 'eslint-config-standard';
import eslintComments from 'eslint-plugin-eslint-comments';
import importPlugin from 'eslint-plugin-import';
import lodash from 'eslint-plugin-lodash';
import jsxAlly from 'eslint-plugin-jsx-a11y';
import node from 'eslint-plugin-node';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import babelParser from '@babel/eslint-parser';

export default [
  {
    files: ['**/*.js', '**/*.jsx'],
    // global rules
    rules: { 
      ...js.configs.recommended.rules,

      // Rule Meaning: 0 - rule off, 1 - rule on as a warning, 2 - rule on as an error (exit code is 1 when triggered)
      'no-unused-vars': 1,
      'no-undef': 1,
      'comma-dangle': [2, 'only-multiline'],
      'space-before-function-paren': [
        1, { anonymous: 'ignore', named: 'ignore', asyncArrow: 'ignore' },
      ],
      semi: [2, 'always'],
      'no-extra-semi': 2,
      'semi-spacing': [2, { before: false, after: true }],
      'new-cap': [2, { properties: false }],
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
      'eslint-comments/no-unused-disable': 1,
      'eslint-comments/disable-enable-pair': [
        'error',
        { allowWholeFile: true },
      ],
      'import/no-extraneous-dependencies': 0,
      'import/newline-after-import': 0,
      'import/no-named-as-default': 0,
      'import/no-unresolved': 2, // to handle cjs node modules to esm
      'import/no-commonjs': 2, // to handle cjs node modules to esm
      'import/extensions': [2, 'ignorePackages'], // to handle cjs node modules to esm
      'lodash/import-scope': [2, 'method'],
      'lodash/prefer-constant': 0,
      'lodash/prefer-lodash-method': 0,
      'lodash/prefer-lodash-typecheck': 0,
      'no-param-reassign': ['error', { props: false }],
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
      'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
      'jsx-a11y/click-events-have-key-events': 0,
      'node/no-deprecated-api': 2
    },
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
      'node': node,
      'react': react,
      'react-hooks': reactHooks,
    },
  },
  {
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
        ...globals.node,
        ...globals.mocha,
        ...globals.react,
        cy: true,
        Cypress: true,
        expect: true,
      },
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
