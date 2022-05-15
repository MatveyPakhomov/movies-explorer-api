const Movie = require("../models/movie");
const NotFoundError = require("../errors/not-found-err");
const BadRequestError = require("../errors/bad-request-err");
const ForbiddenError = require("../errors/forbidden-err");

function getMovies(req, res, next) {
  return (
    Movie.find({})
      // .populate(["owner", "likes"])
      .then((movies) => res.send(movies.reverse()))
      .catch(next)
  );
}

function createMovie(req, res, next) {
  const ownerId = req.user._id;
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;

  return Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    owner: { _id: ownerId },
    movieId,
    nameRU,
    nameEN,
  })
    .then((data) => {
      Movie.findById(data._id)
        // .populate(["owner", "likes"])
        .then((movie) => res.send(movie));
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(
          new BadRequestError(
            `Переданы некорректные данные при создании фильма. ${err.message}`
          )
        );
      } else next(err);
    });
}

function deleteMovie(req, res, next) {
  const userId = req.user._id;

  return (
    Movie.findById(req.params._id)
      // .populate(["owner", "likes"])
      .then((data) => {
        if (!data) {
          throw new NotFoundError("Фильм с указанным id не найдена.");
        }

        const ownerId = data.owner._id.toString();

        if (ownerId !== userId) {
          throw new ForbiddenError(
            "Невовзможно удалить фильм другого пользователя"
          );
        }

        return Movie.findByIdAndRemove(req.params._id).then(() =>
          res.send({ message: "Фильм удален." })
        );
      })
      .catch((err) => {
        if (err.name === "CastError") {
          next(
            new BadRequestError(
              "Переданы некорректные данные для удаления фильма."
            )
          );
        } else next(err);
      })
  );
}

module.exports = { getMovies, createMovie, deleteMovie };
