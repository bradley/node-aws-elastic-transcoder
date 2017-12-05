var bcrypt = require("bcrypt"),
    jwt = require("jsonwebtoken");


module.exports = function(sequelize, DataTypes) {
  var userParams = {};


  userParams.Schema = {
    active : {
      type : DataTypes.BOOLEAN,
      allowNull : false,
      defaultValue : true
    },
    username : {
      type : DataTypes.STRING,
      unique : {
        args : true,
        msg : "Username already taken."
      },
      allowNull : false,
      validate : {
        notEmpty : {
          args : true,
          msg : "Username may not be blank."
        },
        len : {
          args : [1, 15],
          msg : "Username may not be more than 15 characters."
        }
      }
    },
    email : {
      type : DataTypes.STRING,
      unique : {
        args : true,
        msg : "Email already taken."
      },
      allowNull : false,
      validate : {
        notEmpty : {
          args : true,
          msg : "Email must be provided."
        },
        isEmail : {
          args : true,
          msg : "That doesn't appear to be a valid email address."
        }
      }
    },
    password : {
      type : DataTypes.STRING,
      allowNull : false,
      validate : {
        notEmpty : {
          args : true,
          msg : "Password may not be blank."
        },
        isValidLength : function(value) {
          if (value.length < 6) {
            throw new Error("Password must be at least 6 characters.");
          } else if (value.length > 128) {
            throw new Error("Password may be no longer than 128 characters.");
          }
        }
      }
    }
  };


  userParams.ClassMethods = {
    associate: function(models) {
      models.User.hasMany(models.StoryJob, {
        as : "storyJobs",
        foreignKey : "userId"
      });
      models.User.hasMany(models.Story, {
        as : "stories",
        foreignKey : "userId"
      });
    },

    findByUsername : function(username, cb) {
      process.nextTick(function() {
        for (var i = 0, len = records.length; i < len; i++) {
          var record = records[i];

          if (record.username === username) {
            return cb(null, record);
          }
        }
        return cb(null, null);
      });
    },

    generateHash : function(password) {
      var SALT_FACTOR = 5;

      return bcrypt.hashSync(password, bcrypt.genSaltSync(SALT_FACTOR), null);
    }
  };


  userParams.InstanceMethods = {
    validPassword : function(password) {
      return bcrypt.compareSync(password, this.password);
    },

    generateJWTToken : function() {
      var EXPIRY = "8h"; // zeit/ms

      var payload = {
            id : this.id,
            username : this.username,
            email : this.email
          },
          options = {
            expiresIn : EXPIRY
          };

      return jwt.sign(payload, process.env.APP_SECRET, options);
    },

    primaryStory : function() {
      var user = this;

      return new Promise(function(resolve, reject) {
        sequelize.models.Story.findOne({
          where : {
            userId : user.id,
            primaryStory : true,
            active : true
          },
          include : [{ model : sequelize.models.StoryMedia, as : "storyMedia" }]
        }).then(function(primaryStory) {
          resolve(primaryStory);
        }).catch(function(err) {
          reject(err);
        });
      });
    }
  };


  userParams.Hooks = (function() {
    function hashPassword(user, options, next) {
      if (!user.changed("password")) return next();
      user.password = sequelize.models.User.generateHash(user.get("password"));
      next();
    }

    return {
      beforeCreate : hashPassword,
      beforeUpdate : hashPassword
    }
  })();


  var User = sequelize.define("User", userParams.Schema, {
    classMethods : userParams.ClassMethods,
    instanceMethods : userParams.InstanceMethods,
    hooks : userParams.Hooks
  });

  return User;
};
