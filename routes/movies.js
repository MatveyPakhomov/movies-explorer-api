const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const { isValidURL } = require("../utils/methods");

const {
  createMovie,
  getMovies,
  deleteMovie,
} = require("../controllers/movies");

router.post(
  "/movies",
  celebrate({
    body: Joi.object().keys({
      country: Joi.string().required().min(2).max(30),
      director: Joi.string().required().min(2),
      duration: Joi.string().required().min(2),
      year: Joi.string().required().min(4).max(4),
      description: Joi.string().required(),
      image: Joi.string().required().min(2).custom(isValidURL),
      trailerLink: Joi.string().required().min(2).custom(isValidURL),
      thumbnail: Joi.string().required().min(2).custom(isValidURL),
      movieId: Joi.string().hex().length(24).required(),
      nameRU: Joi.string().required().min(2).pattern(new RegExp("^[а-яёА-ЯЁ]$")),
      nameEN: Joi.string().required().min(2).pattern(new RegExp("^[a-zA-Z]$")),
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
