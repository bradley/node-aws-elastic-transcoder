"use strict";

module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable("StoryMedia", {
      id : {
        allowNull : false,
        autoIncrement : true,
        primaryKey : true,
        type : Sequelize.INTEGER
      },
      key : {
        allowNull : false,
        type : Sequelize.STRING
      },
      url : {
        allowNull : false,
        type : Sequelize.STRING
      },
      type : {
        allowNull : false,
        type : Sequelize.STRING
      },
      width : {
        allowNull : false,
        type : Sequelize.INTEGER
      },
      height : {
        allowNull : false,
        type : Sequelize.INTEGER
      },
      duration : {
        allowNull : false,
        type : Sequelize.INTEGER
      },
      createdAt : {
        allowNull : false,
        type : Sequelize.DATE
      },
      updatedAt : {
        allowNull : false,
        type : Sequelize.DATE
      },
      storyId : {
        allowNull : false,
        type : Sequelize.INTEGER,
        references : {
          model : "Story",
          key : "id"
        }
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable("StoryMedia");
  }
};
