const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const { isValidURL } = require("../utils/methods");

const { createMovie, getMovies, deleteMovie } = require("../controllers/movies");

router.post(
  "/movies",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required().custom(isValidURL),
      // # country, director, duration, year, description, image, trailer, nameRU, nameEN и thumbnail, movieId
    }),
  }),
  createMovie
);
router.get("/movies", getMovies);
router.delete(
  "/movies/_id",
  celebrate({
    params: Joi.object().keys({
      _id: Joi.string().hex().length(24).required(),
    }),
  }),
  deleteMovie
);

module.exports = router;
