const express = require("express");

const authorization = require("./authorization");
const user = require("./users");
const movie = require("./movies");
const { auth } = require("../middlewares/auth");

const app = express();

app.use(authorization);
app.use(auth, user);
app.use(auth, movie);

module.exports = app;
