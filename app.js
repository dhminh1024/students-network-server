const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");
const device = require("express-device");
const hpp = require("hpp");
const logger = require("morgan");
const httpStatus = require("http-status");
const mongoose = require("mongoose");
const mongoURI = process.env.MONGODB_URI
  ? process.env.MONGODB_URI
  : require("./config/keys").mongoURI;
const routes = require("./routes/index");
const utilHelper = require("./helpers/util.helper");
const cors = require("cors");
const { AddErrorToLogs } = require("./controllers/bugController");

const app = express();

app.use(logger("dev"));
app.use(device.capture());
// Body parser middleware

// create application/json parser
app.use(
  bodyParser.json({
    limit: "50mb",
  })
);
// create application/x-www-form-urlencoded parser
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: false,
  })
);
// protect against HTTP Parameter Pollution attacks
app.use(hpp());
app.use(
  cookieSession({
    name: "session",
    keys: ["SECRECTKEY"],
    maxAge: 24 * 60 * 60 * 1000,
  })
);
app.use(cookieParser());

// DB Config
mongoose.Promise = global.Promise;

let defaults = {};
Promise.resolve(app)
  .then(MongoDBConnection)
  .catch((err) =>
    console.error.bind(
      console,
      `MongoDB connection error: ${JSON.stringify(err)}`
    )
  );

// Database Connection
async function MongoDBConnection(app) {
  console.log(`| MongoDB URL  : ${mongoURI}`);
  await mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });
  console.log("| MongoDB Connected");
  console.log("|--------------------------------------------");

  return app;
}
app.use(cors());

app.use("/api", routes);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
// no stacktraces leaked to user unless in development environment
app.use((err, req, res, next) => {
  if (err.status === 404) {
    return utilHelper.sendResponse(
      res,
      httpStatus.NOT_FOUND,
      false,
      null,
      err,
      "Route Not Found",
      null
    );
  } else {
    console.log("\x1b[41m", err);
    AddErrorToLogs(req, res, next, err);
    return utilHelper.sendResponse(
      res,
      httpStatus.INTERNAL_SERVER_ERROR,
      false,
      null,
      err,
      null,
      null
    );
  }
});

module.exports = app;
