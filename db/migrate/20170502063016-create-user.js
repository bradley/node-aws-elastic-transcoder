"use strict";

module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable(
      "User",
      {
        id : {
          allowNull : false,
          autoIncrement : true,
          primaryKey : true,
          type : Sequelize.INTEGER
        },
        username : {
          allowNull  : false,
          type : Sequelize.STRING,
          unique : true
        },
        email : {
          allowNull  : false,
          type : Sequelize.STRING,
          unique : true
        },
        password : {
          allowNull  : false,
          type : Sequelize.STRING
        },
        createdAt : {
          allowNull : false,
          type : Sequelize.DATE
        },
        updatedAt : {
          allowNull : false,
          type : Sequelize.DATE
        }
      }
    );
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable("User");
  }
};
