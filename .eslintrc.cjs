/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:import/recommended', 'prettier'],
  settings: {
    'import/ignore': ['node_modules'],
  },
  plugins: ['@typescript-eslint', 'import', 'simple-import-sort'],
  root: true,
  ignorePatterns: ['node_modules/'],
  rules: {
    'consistent-return': 2,
    indent: [1, 2],
    'no-else-return': 1,
    semi: [1, 'always'],
    'space-unary-ops': 2,
    'simple-import-sort/imports': 'warn',
    'simple-import-sort/exports': 'warn',
    quotes: [1, 'single'],
    'import/no-unresolved': 'off',
    '@typescript-eslint/no-unused-vars': [
      1,
      {
        varsIgnorePattern: '^debug$',
        argsIgnorePattern: '^_',
      },
    ],
    '@typescript-eslint/no-non-null-assertion': 'error',
  },
};
