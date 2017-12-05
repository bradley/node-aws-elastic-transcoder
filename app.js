#!/usr/bin/env node

// Setup ========================================================================
var path = require("path"),
    env = require("dotenv").load(),
    express = require("express"),
    config = require("config"),
    app = express(),
    server = require("http").createServer(app),
    morgan = require("morgan");

var models = require(path.resolve(__dirname, "api/models"));

var passport = require("passport"),
    configPassport = require(path.resolve(__dirname, "config/passport")),
    contentType = require(path.resolve(__dirname, "api/utils/content_type")),
    cookieParser = require("cookie-parser"),
    cookieSession = require("cookie-session"),
    bodyParser = require("body-parser"),
    viewEngine = require("express-json-views");


// Configure Application  =======================================================
app.use(express.logger());

if (app.get("env") == "development") {
  app.use(morgan("dev"));
  app.use(express.errorHandler({
    dumpExceptions : true,
    showStack : true
  }));
}

if (app.get("env") == "production") {
  app.use(morgan("common"));
  app.configure("production", function() {
    app.use(express.errorHandler());
  });
}

// Init Models ==================================================================
// Create models singleton to avoid opening more than one database connection.
app.set("models", models);


// Passport =====================================================================
app.use(cookieParser());
app.use(cookieSession({ secret : config.app.secret }));
app.use(passport.initialize());
configPassport(passport, models.User);


// Routes =======================================================================
app.use(express.methodOverride());
app.use(contentType.overrideContentType());
app.use(bodyParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : true }));
app.use(app.router);
require("./config/routes")(app, passport);


// Views ========================================================================
app.engine("json", viewEngine({
  helpers : require(path.resolve(__dirname, "api/views/helpers"))
}));
app.set("views", path.resolve(__dirname, "api/views"));
app.set("view engine", "json");


// Begin Listening ==============================================================
server.listen(config.express.port, function(error) {
  if (error) {
    console.log("Unable to listen for connections: %s", error);
    process.exit(10);
  }
  console.log("🌎  API is running on port: %s", config.express.port);
});
