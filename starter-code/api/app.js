require('dotenv').config()
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
var mongoose = require("mongoose");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var testAPIRouter = require("./routes/testAPI");

var ridesRouter = require("./routes/rides");

var app = express();

const connect = async() => {
    var url = ""
    if (process.env.NODE_ENV == "test") {
        url = process.env.MONGODB_URI_TEST
    }
    else if (process.env.NODE_ENV == "dev"){
        url = process.env.MONGODB_URI_DEV
    }
    else if (process.env.NODE_ENV == "production") {
        url = process.env.MONGODB_URI
    }

    await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true})
    .then(result => {
      console.log('connected to MongoDB')
      app.emit("mongoConnected")
    })
    .catch((error) => {
      console.log('error connecting to MongoDB:', error.message)
    })
    return mongoose.connection
}

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/testAPI", testAPIRouter);

app.use("/rides", ridesRouter);

const connection = connect();

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

module.exports = app;
