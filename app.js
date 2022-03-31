require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { errors } = require("celebrate");

const routes = require("./routes/index");
const NotFoundError = require("./errors/not-found-err");
const { requestLogger, errorLogger } = require("./middlewares/logger");

const { NODE_ENV, DB_ADRESS, PORT = 3000 } = process.env;
const app = express();
mongoose.connect(
  NODE_ENV === "production"
    ? DB_ADRESS
    : "mongodb://localhost:27017/moviesdb-local"
);

app.use(
  "*",
  cors({
    origin: [
      "https://pakhomov.diploma.nomoredomains.work",
      "http://pakhomov.diploma.nomoredomains.work",
      "http:localhost:3000",
    ],
    methods: ["OPTIONS", "GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    preflightContinue: false,
    optionsSuccessStatus: 204,
    allowedHeaders: ["Content-Type", "origin", "Authorization", "Cookie"],
    exposedHeaders: ["Set-Cookie"],
    credentials: true,
  })
);

app.use(requestLogger); // подключаем логгер запросов
app.use(bodyParser.json()); // для собирания JSON-формата
app.use(bodyParser.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса
app.use(cookieParser());

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Сервер сейчас упадёт");
  }, 0);
});

app.use(routes);

app.use("*", (req, res, next) => {
  next(new NotFoundError("Страница не найдена"));
});

app.use(errorLogger); // подключаем логгер ошибок

app.use(errors());

app.use((err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    // проверяем статус и выставляем сообщение в зависимости от него
    message: err.statusCode === 500 ? "На сервере произошла ошибка" : message,
  });
  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
