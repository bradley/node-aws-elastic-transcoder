// Note: This is for use by sequelize-cli. To see actual database
//   connection information, see `/api/models/index.js`.
require('dotenv').config();


module.exports = {
  "development" : {
    "database" : process.env.POSTGRES_DATABASE,
    "username" : process.env.POSTGRES_USERNAME,
    "password" : process.env.POSTGRES_PASSWORD,
    "host" : process.env.POSTGRES_HOST,
    "port" : process.env.POSTGRES_PORT,
    "dialect" : "postgres"
  },

  "test"   : {
    "database" : process.env.POSTGRES_DATABASE,
    "username" : process.env.POSTGRES_USERNAME,
    "password" : process.env.POSTGRES_PASSWORD,
    "host" : process.env.POSTGRES_HOST,
    "port" : process.env.POSTGRES_PORT,
    "dialect" : "postgres"
  },

  "production" : {
    "database" : process.env.POSTGRES_DATABASE,
    "username" : process.env.POSTGRES_USERNAME,
    "password" : process.env.POSTGRES_PASSWORD,
    "host" : process.env.POSTGRES_HOST,
    "port" : process.env.POSTGRES_PORT,
    "dialect" : "postgres"
  }
}
