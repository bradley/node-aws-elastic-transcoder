"use strict";

module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable("Story", {
      id : {
        allowNull : false,
        autoIncrement : true,
        primaryKey : true,
        type : Sequelize.INTEGER
      },
      active : {
        type : Sequelize.BOOLEAN,
        allowNull : false,
        defaultValue : true
      },
      primaryStory : {
        type : Sequelize.BOOLEAN,
        allowNull : false,
        defaultValue : false
      },
      outputKeyPrefix : {
        type : Sequelize.STRING,
        allowNull : false,
        unique : true
      },
      createdAt : {
        allowNull : false,
        type : Sequelize.DATE
      },
      updatedAt : {
        allowNull : false,
        type : Sequelize.DATE
      },
      userId : {
        allowNull : false,
        type : Sequelize.INTEGER,
        references : {
          model : "User",
          key : "id"
        }
      },
      storyJobId : {
        allowNull : false,
        type : Sequelize.INTEGER,
        references : {
          model : "StoryJob",
          key : "id"
        }
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable("Story");
  }
};
