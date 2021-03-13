module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: ['eslint:recommended', 'prettier', 'eslint-config-prettier'],
  parserOptions: {
    ecmaVersion: 12,
  },
};
