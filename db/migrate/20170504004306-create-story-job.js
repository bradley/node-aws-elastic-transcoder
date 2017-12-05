"use strict";

module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable("StoryJob", {
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
      referenceId : {
        type : Sequelize.STRING,
        allowNull : false,
        unique : true
      },
      rawResponse : {
        type : Sequelize.TEXT
      },
      responseState : {
        type : Sequelize.STRING
      },
      responseReceivedAt : {
        type : Sequelize.DATE
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
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable("StoryJob");
  }
};
