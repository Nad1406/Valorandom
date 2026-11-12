module.exports = {
  root: true,
  env: { browser: true, es2022: true, node: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'prettier',
  ],
  ignorePatterns: ['dist', 'node_modules', 'playwright-report', 'test-results', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  plugins: ['@typescript-eslint', 'react-refresh'],
  rules: {
    'react-refresh/only-export-components': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
    ],
    '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
    'no-restricted-globals': [
      'error',
      {
        name: 'Math',
        message: 'Use the injected Rng from @/features/random/rng in business logic.',
      },
    ],
  },
  overrides: [
    {
      files: ['src/features/random/**/*.ts', 'src/features/squad/**/*.ts'],
      rules: { 'no-restricted-globals': 'off' },
    },
    {
      files: ['scripts/**/*.ts', 'tests/**/*.ts', '**/*.test.ts', '**/*.test.tsx'],
      env: { node: true },
      rules: { 'no-restricted-globals': 'off' },
    },
  ],
};
