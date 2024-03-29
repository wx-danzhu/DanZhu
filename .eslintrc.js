module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  ignorePatterns: [
    'js/libs/*.js',
  ],
  rules: {
    'linebreak-style': 0,
  },
};
