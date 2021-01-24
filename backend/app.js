const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const errorhandler = require("errorhandler");
const mongoose = require("mongoose");

const app = express();
require('dotenv').config();

app.use(cors());

// Normal express config defaults
app.use(require("morgan")("dev"));
app.use("/uploads",express.static("uploads"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const isProduction = process.env.NODE_ENV === "production";
if (!isProduction) {
  app.use(errorhandler());
}

if (isProduction) {
  mongoose.connect(process.env.MONGODB_URI);
} else {
  mongoose.connect("mongodb://localhost/stackhacks", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });
  mongoose.set("debug", true);
}

require("./models/User");
require("./models/Category");
require("./models/FoodItem");
require("./models/Order");
require("./config/passport");

app.use(require("./routes"));

/// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (!isProduction) {
  app.use(function (err, req, res, next) {
    console.log(err.stack);

    res.status(err.status || 500);

    res.json({
      errors: {
        message: err.message,
        error: err,
      },
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    errors: {
      message: err.message,
      error: {},
    },
  });
});

// let's start our server...
const server = app.listen(process.env.PORT || 3030, function () {
  console.log("Listening on port " + server.address().port);
});
