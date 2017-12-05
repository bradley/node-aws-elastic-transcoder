// About
//   Helper file to automatically connect to database and sync models in the `api/models/`
//   directory to our postgres server on app startup.
// Usage
//   Please access models within modules in our application by using `app.get("models").myModelName`
//   rather than importing the model directly. For example:
//      Good:
//        var models = app.get("models"),
//            User = models.User;
//      Bad:
//        var User = require("./app/models/user");

var fs = require("fs"),
  	path = require("path"),
  	Sequelize = require("sequelize"),
    SequelizeConstants = require("sequelize-constants"),
  	env = process.env.NODE_ENV || "development",
  	config = require("config"),
  	db = {};


var sequelize = new Sequelize(config.db.database, config.db.username, config.db.password, {
  host : config.db.host,
  port : config.db.port,
  dialect : "postgres",

  define : {
    freezeTableName : true
  },

  pool : {
    max : 5,
    min : 0,
    idle : 10000
  }
});

// Allow a `constant` object on sequelize models for handling constants.
SequelizeConstants(sequelize);

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf(".") !== 0) && (file !== "index.js");
  })
  .forEach(function(file) {
    var model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function(modelName) {
  if ("associate" in db[modelName]) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;


module.exports = db;
