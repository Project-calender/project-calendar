module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },

  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:prettier/recommended',
  ],

  plugins: ['react'],

  rules: {
    'prettier/prettier': ['warn'],
    'react/jsx-filename-extension': ['error', { extensions: ['.js', '.jsx'] }],
  },

  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
};
