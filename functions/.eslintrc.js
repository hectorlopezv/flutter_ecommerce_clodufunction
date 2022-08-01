module.exports = {
  root: true,
  env: {
    node: true,
    es8: true,
  },
  extends: ["eslint:recommended", "google"],
  rules: {
    quotes: ["error", "double"],
  },
};
