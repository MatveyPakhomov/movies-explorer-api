const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const isEmail = require("validator/lib/isEmail");
const UnauthorizedError = require("../errors/unauthorized-err");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => isEmail(v),
      message: "Неправильный формат почты",
    },
  },
  password: {
    type: String,
    minlength: 8,
    required: true,
    select: false, // необходимо добавить поле select
  },
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: "Пользователь",
  },
});

userSchema.statics.findUserByCredentials = function findUser(email, password) {
  // попытаемся найти пользователя по почте
  return this.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        return Promise.reject(
          new UnauthorizedError("Неправильные почта или пароль")
        );
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(
            new UnauthorizedError("Неправильные почта или пароль")
          );
        }

        return user; // теперь user доступен
      });
    });
};

// const regex =
//   /https?:\/\/(www\.)?[\w-.~:/?#[\]@!$&'()*+,;=]{1,256}\.[\w-.~:/?#[\]@!$&'()*+,;=]{1,6}/i;

// Шаблон находит url таких форматов:
// const testUrls = [
//   "http://ya.ru",
//   "https://www.ya.ru",
//   "http://2-domains.ru",
//   "http://ya.ru/path/to/deep/",
//   "http://ya-ya-ya.ru",
// ];

// testUrls.forEach((url) => {
//   if (regex.test(url)) {
//     console.log(`Correct: ${url}`);
//   } else {
//     console.log(`Wrong: ${url}`);
//   }
// });

// const validator = function avatarValidator(value) {
//   return regex.test(value);
// };
// userSchema.path("avatar").validate(validator, "Avatar URL is not valid");

module.exports = mongoose.model("user", userSchema);
