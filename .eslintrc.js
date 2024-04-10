module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
    node: true,
    es2021: true,
  },
  parserOptions: {
    ecmaVersion: 2020,
  },
  plugins: [],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  rules: {
    'no-console': 'warn',
    'no-debugger': 'warn',
    'no-restricted-imports': 'off',
    'comma-dangle': 'off',
    '@typescript-eslint/comma-dangle': ['error', 'always-multiline'],
    'space-before-function-paren': 'off',
    '@typescript-eslint/space-before-function-paren': ['error', {
      anonymous: 'always',
      named: 'never',
    }],
    'object-shorthand': ['error', 'properties', { avoidQuotes: true }],
    'space-before-blocks': 'off',
    '@typescript-eslint/space-before-blocks': 'warn',
    'func-call-spacing': 'off',
    '@typescript-eslint/func-call-spacing': 'warn',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      { vars: 'all', args: 'none', ignoreRestSiblings: true },
    ],
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'no-useless-constructor': 'off',
    'standard/no-callback-literal': 'off',
  },
  overrides: [
    {
      files: ['*.ts'],
      rules: {
        'no-undef': 'off',
      },
    },
  ],
}
