const { Client } = require("pg");

let DB_URI;

// If we're running in test "mode", use our test db
// Make sure to create both databases!
if (process.env.NODE_ENV === "test") {
  DB_URI = "postgresql:///cpt";
} else {
 // DB_URI = "postgres://qahwcmftxrqexb:3a7c8c354788872409c686995e8928d45af8c39a758bc5da72f33d68b9d535fa@ec2-184-73-249-9.compute-1.amazonaws.com:5432/dcksoa3ku6gd3i";
  DB_URI = "postgresql:///cpt";
}

let db = new Client({
  connectionString: DB_URI
});

db.connect();

module.exports = db;