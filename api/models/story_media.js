module.exports = function(sequelize, DataTypes) {
  var storyMediaParams = {};


  storyMediaParams.Schema = {
    key : {
      allowNull : false,
      type : DataTypes.STRING
    },
    url : {
      allowNull : false,
      type : DataTypes.STRING
    },
    type : {
      allowNull : false,
      type : DataTypes.STRING
    },
    width : {
      allowNull : false,
      type : DataTypes.INTEGER
    },
    height : {
      allowNull : false,
      type : DataTypes.INTEGER
    },
    duration : {
      allowNull : false,
      type : DataTypes.INTEGER
    }
  };


  storyMediaParams.ClassMethods = {
    associate : function(models) {
      models.StoryMedia.belongsTo(models.Story, {
        as : "story",
        foreignKey : "storyId"
      });
    },

    extensionForKey : function(key) {
      var match = key.match(/(\.(\w+))$/),
          extension;

      if (match) {
        extension = match[2]; // We just want the part after the `.`
      }

      return extension;
    }
  };


  storyMediaParams.Hooks = (function() {
    function setFileTypeAndUrl(storyMedia, options, next) {
      if (storyMedia.changed("key")) {
        storyMedia.type = sequelize.models.StoryMedia.extensionForKey(storyMedia.key);
      }
      next();
    }

    return {
      beforeValidate : setFileTypeAndUrl
    }
  })();


  var StoryMedia = sequelize.define("StoryMedia", storyMediaParams.Schema, {
    classMethods : storyMediaParams.ClassMethods,
    instanceMethods : storyMediaParams.InstanceMethods,
    hooks : storyMediaParams.Hooks
  });

  return StoryMedia;
};
