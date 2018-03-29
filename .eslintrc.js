module.exports = {
  parser: "babel-eslint",
  extends: ["airbnb-base", "prettier"],
  plugins: ["jest"],
  env: {
    "jest/globals": true
  },
  rules: {
    "no-restricted-properties": 0,
    "no-param-reassign": ["warn"],
    "prefer-destructuring": ["warn"]
  }
};
