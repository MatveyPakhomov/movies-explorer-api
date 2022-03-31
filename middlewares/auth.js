const jwt = require("jsonwebtoken");
const UnauthorizedError = require("../errors/unauthorized-err");

function auth(req, res, next) {
  const token = req.cookies.jwt;
  const { NODE_ENV, JWT_SECRET } = process.env;

  if (!token) {
    throw new UnauthorizedError("Необходимо авторизоваться.");
  }

  let payload;

  try {
    // попытаемся верифицировать токен
    payload = jwt.verify(
      token,
      NODE_ENV === "production" ? JWT_SECRET : "some-secret-key"
    );
  } catch (err) {
    // отправим ошибку, если не получилось
    throw new UnauthorizedError("Необходимо авторизоваться.");
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  return next(); // пропускаем запрос дальше
}

module.exports = { auth };
