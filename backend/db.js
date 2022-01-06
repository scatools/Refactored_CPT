///////////////////////////////////////////////////////////
//// Connection -- Database Settings and Configuration ////
///////////////////////////////////////////////////////////

const { Client } = require("pg");

// For development on local server

// var db = new Client({
//   user: "postgres",
//   password: "password",
//   database: "cpt",
//   port: 5432,
//   host: "localhost"
// });

// For production on Heroku

// Need to specify ssl attribute
var db = new Client({
  // Need to set these config variables beforehand in Heroku environment settings
  // For more details, refer to https://devcenter.heroku.com/articles/config-vars
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: "d5l5a3g2eqfbbh",
  port: 5432,
  host: "ec2-100-25-121-253.compute-1.amazonaws.com",
  ssl: { rejectUnauthorized: false }
}); 

db.connect();

module.exports = db;