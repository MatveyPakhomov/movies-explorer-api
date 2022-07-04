const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const { getUser, updateUser } = require("../controllers/users");

const { NODE_ENV } = process.env;

router.post("/signout", (req, res) => {
  res
    .clearCookie("jwt", {
      secure: true,
      sameSite: "none",
      domain:
        NODE_ENV === "production"
          ? "pakhomov.diploma.nomoredomains.work"
          : false,
    })
    .send({ message: "Выход совершен успешно" });
});
router.get("/users/me", getUser);
router.patch(
  "/users/me",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      email: Joi.string().required().email(),
    }),
  }),
  updateUser
);

module.exports = router;
