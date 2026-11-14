/**
 * Summary:
 * Battle-tested ESLint flat config for plain JavaScript (+ React)
 * repos — no TypeScript. Built on `@eslint/js` `recommended` plus a
 * handful of core rules (`eqeqeq`, `no-shadow`, `no-implicit-coercion`,
 * `consistent-return`) that approximate bug classes a type checker
 * would otherwise catch, plus React, Hooks, accessibility, and
 * import-hygiene rules. Prettier handles formatting;
 * `eslint-config-prettier` disables ESLint's own stylistic rules so
 * the two never fight.
 *
 * Setup:
 * 1. Install dependencies:
 *      npm i -D eslint eslint-plugin-react eslint-plugin-react-hooks \
 *        eslint-plugin-jsx-a11y eslint-plugin-import \
 *        eslint-config-prettier globals
 * 2. Copy this file to your repo root as `eslint.config.js`.
 */

import js from '@eslint/js';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import importPlugin from 'eslint-plugin-import';
import eslintConfigPrettier from 'eslint-config-prettier';
import globals from 'globals';

export default [
  {
    ignores: ['dist/**', 'build/**', 'coverage/**', 'node_modules/**'],
  },
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.browser, ...globals.node },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
      import: importPlugin,
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.configs.recommended.rules,

      eqeqeq: ['error', 'always'],
      'no-var': 'error',
      'prefer-const': 'error',
      'no-shadow': 'error',
      'no-implicit-coercion': 'error',
      'consistent-return': 'error',
      'no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],

      'react/prop-types': 'warn',
      'react/react-in-jsx-scope': 'off',
      'react/no-array-index-key': 'warn',
      'react/no-unstable-nested-components': 'error',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      'import/no-cycle': 'error',
      'import/no-self-import': 'error',
      'import/order': [
        'warn',
        { 'newlines-between': 'always', alphabetize: { order: 'asc' } },
      ],
    },
  },
  eslintConfigPrettier,
];
