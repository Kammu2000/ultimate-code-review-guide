/**
 * Summary:
 * Battle-tested ESLint flat config for TypeScript (+ React) repos.
 * Built on typescript-eslint's `strict-type-checked` +
 * `stylistic-type-checked` presets (type-aware linting), plus React,
 * Hooks, accessibility, and import-hygiene rules. Prettier handles
 * formatting; `eslint-config-prettier` disables ESLint's own
 * stylistic rules so the two never fight.
 *
 * Setup:
 * 1. Install dependencies:
 *      npm i -D eslint typescript-eslint eslint-plugin-react \
 *        eslint-plugin-react-hooks eslint-plugin-jsx-a11y \
 *        eslint-plugin-import eslint-config-prettier
 * 2. Ensure a `tsconfig.json` exists at the project root (required by
 *    `projectService: true` for type-aware rules) — see
 *    `./tsconfig.json` for a starter.
 * 3. Copy this file to your repo root as `eslint.config.js`.
 */

import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import importPlugin from 'eslint-plugin-import';
import eslintConfigPrettier from 'eslint-config-prettier';

export default tseslint.config(
  {
    ignores: ['dist/**', 'build/**', 'coverage/**', 'node_modules/**'],
  },
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
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

      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],

      'react/prop-types': 'off',
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
);
