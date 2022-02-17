const isURL = require("validator/lib/isURL");

module.exports.isValidURL = (value) => {
  const valid = isURL(value);
  if (valid) {
    return value;
  }
  throw new Error("URL validation err");
};
