const Movie = require("../models/movie");
const NotFoundError = require("../errors/not-found-err");
const BadRequestError = require("../errors/bad-request-err");
const ForbiddenError = require("../errors/forbidden-err");

function getMovies(req, res, next) {
  return Movie.find({})
    .populate(["owner", "likes"]) // # country, director, duration, year, description, image, trailer, nameRU, nameEN и thumbnail, movieId
    .then((movies) => res.send(movies.reverse()))
    .catch(next);
}

function createMovie(req, res, next) {
  const ownerId = req.user._id;
  const { name, link } = req.body;

  return Movie.create({ name, link, owner: { _id: ownerId } })
    .then((data) => {
      Movie.findById(data._id)
        .populate(["owner", "likes"])
        .then((movie) => res.send(movie));
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(
          new BadRequestError(
            `Переданы некорректные данные при создании карточки. ${err.message}`
          )
        );
      }
      next(err);
    });
}

function deleteMovie(req, res, next) {
  const userId = req.user._id;

  return Movie.findById(req.params._id)
    .populate(["owner", "likes"])
    .then((data) => {
      if (!data) {
        throw new NotFoundError("Карточка с указанным _id не найдена.");
      }

      const ownerId = data.owner._id.toString();

      if (ownerId !== userId) {
        throw new ForbiddenError(
          "Невовзможно удалить карточку созданную другим пользователем"
        );
      }

      Movie.findByIdAndRemove(req.params._id).then(() =>
        res.send({ message: "Карточка удалена." })
      );
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(
          new BadRequestError(
            "Переданы некорректные данные для удаления карточки."
          )
        );
      }
      next(err);
    });
}

module.exports = { getMovies, createMovie, deleteMovie };
