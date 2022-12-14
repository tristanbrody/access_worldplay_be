const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
require("dotenv").config();
const indexRouter = require("./routes/index");
const authorizationRouter = require("./routes/authorization");
const bodyParser = require("body-parser");
const cors = require("cors");
const { sequelize } = require("./Models.js");

const app = express();
app.use(bodyParser.json());
app.use(logger("dev"));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/authorization", authorizationRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send("error");
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log("connected successfully");
    await sequelize.sync({ alter: true });
    console.log("synced correctly");
  } catch (err) {
    console.log("cannot connect to DB");
    console.dir(err);
  }
})();
module.exports = app;
