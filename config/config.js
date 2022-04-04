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
    username: b72525e1b035da,
    password: 2e505ba3,
    database: heroku_5d1678b7f29311b,
    host: eu-cdbr-west-02.cleardb.net,
    dialect: "mysql",
  },
};
//deploy
