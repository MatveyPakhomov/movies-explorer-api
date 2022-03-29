const mongoose = require("mongoose");
const isURL = require("validator/lib/isURL");

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  director: {
    type: String,
    required: true,
    minlength: 2,
  },
  duration: {
    type: Number,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  year: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 4,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    minlength: 2,
    validate: {
      validator: (v) => isURL(v),
      message: "Неправильный формат ссылки",
    },
  },
  trailerLink: {
    type: String,
    required: true,
    minlength: 2,
    validate: {
      validator: (v) => isURL(v),
      message: "Неправильный формат ссылки",
    },
  },
  thumbnail: {
    type: String,
    required: true,
    minlength: 2,
    validate: {
      validator: (v) => isURL(v),
      message: "Неправильный формат ссылки",
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  movieId: {
    // id фильма, который содержится в ответе сервиса MoviesExplorer. Обязательное поле
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  nameRU: {
    // название фильма на русском языке.
    type: String,
    required: true,
    minlength: 2,
  },
  nameEN: {
    // название фильма на английском языке.
    type: String,
    required: true,
    minlength: 2,
  },
});

module.exports = mongoose.model("movie", movieSchema);
