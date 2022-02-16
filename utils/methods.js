const isEmail = require("validator/lib/isEmail");

module.exports.isValidEmail = (value) => {
  const valid = isEmail(value);
  if (valid) {
    return value;
  }
  throw new Error("Email validation err");
};
