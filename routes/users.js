const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const { isValidEmail } = require("../utils/methods");

const {
  getUser,
  updateUser,
} = require("../controllers/users");

router.get("/users/me", getUser);
router.patch(
  "/users/me",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      email: Joi.string().required().custom(isValidEmail),
    }),
  }),
  updateUser
);

module.exports = router;
