require("dotenv").config(); // this is important!
module.exports = {
  development: {
    username: "root",
    password: process.env.DB_LOCALHOST_PASSWORD,
    database: "groupomaniaDB",
    host: "localhost",
    dialect: "mysql",
  },
  test: {
    username: "root",
    password: null,
    database: "database_test",
    host: "127.0.0.1",
    dialect: "mysql",
  },
  production: {
    username: "root",
    password: null,
    database: "database_prod",
    host: "127.0.0.1",
    dialect: "mysql",
  },
};
