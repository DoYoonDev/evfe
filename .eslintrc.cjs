module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@tanstack/eslint-plugin-query/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['simple-import-sort', 'react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    // TanStack Query 권장 규칙! (plugin:@tanstack/eslint-plugin-query/recommended)
    // '@tanstack/query/exhaustive-deps': 'error',
    // '@tanstack/query/stable-query-client': 'error',
    // '@tanstack/query/no-rest-destructuring': 'warn'
  },
  'parserOptions': {
    'sourceType': 'module',
    'ecmaVersion': 'latest'
  }
};
