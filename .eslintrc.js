module.exports = {
  parser: "babel-eslint",
  extends: ["airbnb-base", "prettier"],
  plugins: ["jest"],
  env: {
    "jest/globals": true
  },
  rules: {
    "class-methods-use-this": 0,
    "no-restricted-properties": 0,
    "no-param-reassign": ["warn"],
    "prefer-destructuring": ["warn"]
  }
};
