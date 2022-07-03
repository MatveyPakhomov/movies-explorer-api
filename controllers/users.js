const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const BadRequestError = require("../errors/bad-request-err");
const ConflictError = require("../errors/conflict-err");
const NotFoundError = require("../errors/not-found-err");
const UnauthorizedError = require("../errors/unauthorized-err");

const User = require("../models/user");

function login(req, res, next) {
  const { email, password } = req.body;
  const { NODE_ENV, JWT_SECRET } = process.env;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === "production" ? JWT_SECRET : "some-secret-key",
        {
          expiresIn: "7d",
        }
      );

      if (!token) {
        throw new UnauthorizedError("Ошибка авторизации");
      }

      res
        .status(200)
        .cookie("jwt", token, {
          maxAge: 3600000 * 24 * 7,
          // secure: true,
          sameSite: false,
          // domain:
          //   NODE_ENV === "production"
          //     ? "pakhomov.diploma.nomoredomains.work"
          //     : false,
        })
        .send({ message: "Аутентификация пройдена" })
        .end();
    })
    .catch(next);
}

function createUser(req, res, next) {
  const { name, email } = req.body;

  return bcrypt
    .hash(req.body.password, 10)
    .then((hash) =>
      User.create({
        name,
        email,
        password: hash,
      })
    )
    .then(() => res.status(200).send({ data: { name, email } }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(
          new BadRequestError(
            `Переданы некорректные данные при создании пользователя. ${err.message}`
          )
        );
      } else if (err.name === "MongoServerError" && err.code === 11000) {
        next(new ConflictError("Данный email уже зарегистрирован."));
      } else {
        next(err);
      }
    });
}

function getUser(req, res, next) {
  return User.findById(req.user._id)
    .then((user) => {
      res.status(200).send(user);
    })
    .catch(next);
}

function updateUser(req, res, next) {
  const { email, name } = req.body;
  return User.findByIdAndUpdate(
    req.user._id,
    { email, name },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    }
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError("Пользователь с указанным id не найден.");
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(
          new BadRequestError(
            `Переданы некорректные данные при обновлении профиля. ${err.message}`
          )
        );
      } else if (err.name === "MongoServerError" && err.code === 11000) {
        next(
          new ConflictError("Данный email используется другим пользователем.")
        );
      } else {
        next(err);
      }
    });
}

module.exports = {
  login,
  createUser,
  getUser,
  updateUser,
};
