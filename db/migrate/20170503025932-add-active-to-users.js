"use strict";

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn(
      "User",
      "active",
      {
        type : Sequelize.BOOLEAN,
        allowNull : false,
        defaultValue : true
      }
    );
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn("User", "active");
  }
};
