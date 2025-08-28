import typescriptEslint from '@typescript-eslint/eslint-plugin';
import angularEslint from '@angular-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

export default [
  // Ignorar completamente el directorio coverage
  {
    ignores: ['**/coverage/**', '**/dist/**', '**/node_modules/**'],
  },
  // Configuración para archivos TypeScript
  {
    files: ['src/**/*.ts'],
    ignores: ['**/*.spec.ts'],
    plugins: {
      '@typescript-eslint': typescriptEslint,
      '@angular-eslint': angularEslint,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json',
      },
    },
    rules: {
      ...typescriptEslint.configs.recommended.rules,
      ...angularEslint.configs.recommended.rules,
      '@angular-eslint/prefer-standalone': 'off',
      '@angular-eslint/prefer-inject': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
  // Configuración para archivos de prueba
  {
    files: ['src/**/*.spec.ts'],
    plugins: {
      '@typescript-eslint': typescriptEslint,
      '@angular-eslint': angularEslint,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json',
      },
    },
    rules: {
      ...typescriptEslint.configs.recommended.rules,
      ...angularEslint.configs.recommended.rules,
      '@angular-eslint/prefer-standalone': 'off',
      '@angular-eslint/prefer-inject': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
];
