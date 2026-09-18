import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import prettierConfig from 'eslint-config-prettier';
import globals from 'globals';

export default tseslint.config(
  // Files to ignore globally
  {
    ignores: ['**/node_modules/**', '**/dist/**', '**/.vite/**', 'backend/drizzle/**'],
  },

  // Base JS rules for all files
  js.configs.recommended,

  // TypeScript rules for backend
  {
    files: ['backend/src/**/*.ts'],
    extends: [tseslint.configs.recommended],
    languageOptions: {
      globals: globals.node,
      parserOptions: {
        project: './backend/tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },

  // TypeScript + React rules for frontend
  {
    files: ['frontend/src/**/*.{ts,tsx}'],
    extends: [tseslint.configs.recommended],
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooks,
    },
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        project: './frontend/tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off', // Not needed with React 17+ JSX transform
      'react/prop-types': 'off', // TypeScript handles this
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },

  // Disable Prettier-conflicting rules (must be last)
  prettierConfig,
);
