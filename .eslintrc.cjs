module.exports = {
  plugins: ['html'],
  extends: [
    'eslint:recommended',
    'prettier',
    'eslint-config-prettier',
    'plugin:import/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  env: {
    es6: true,
    node: true,
    browser: true,
  },
  ignorePatterns: ['**/node_modules/**'],
  rules: {
    quotes: ['error', 'single', { avoidEscape: true, allowTemplateLiterals: true }],
    'no-var': 'error',
    indent: ['error', 2, { SwitchCase: 1 }],
    'no-multi-spaces': 'error',
    'space-in-parens': 'error',
    'no-multiple-empty-lines': 'error',
    'prefer-const': 'error',
  },
  overrides: [
    {
      files: ['**/*.html'],
      rules: {
        'no-unused-vars': ['off'],
        'max-lines-per-function': ['off'],
      },
    },
    {
      files: ['**/*-otp.html'],
      rules: {
        'no-undef': ['off'],
      },
    },
    {
      files: ['**/*-otp.js'],
      rules: {
        'no-unused-vars': ['off'],
      },
    },
  ],
};
