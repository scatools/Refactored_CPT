///////////////////////////////////////////////////////////
// Preparation -- Synchronize Local Database with Heroku //
///////////////////////////////////////////////////////////

// In Control Panel:

// (SET PATH)

// In command line tool:

// This doesn't work on Windows:
// heroku pg:push cpt postgresql-perpendicular-05363 --app sca-cpt

// Use this instead:
// SET PGUSER=postgres 
// SET PGPASSWORD=localdbpassword 
// pg_dump -U postgres -F c -c -O cpt > cpt_dump.sql 
// SET PGUSER=ydbtkyjjovdgii
// SET PGPASSWORD=704962b7ca2d22f1311362729c53439949ecfcd339a2254be39b7d9706ad3e63
// pg_restore -h ec2-54-145-224-156.compute-1.amazonaws.com -d d357fss3k147t7 < cpt_dump.sql

// Share the database of sca-cpt with sca-cpt-backend
// heroku config:add DATABASE_URL=postgres://ydbtkyjjovdgii:704962b7ca2d22f1311362729c53439949ecfcd339a2254be39b7d9706ad3e63@ec2-54-145-224-156.compute-1.amazonaws.com:5432/d357fss3k147t7 --app sca-cpt-backend
// heroku addons:attach sca-cpt::DATABASE --app sca-cpt-backend

///////////////////////////////////////////////////////////
//// Connection -- Database Settings and Configuration ////
///////////////////////////////////////////////////////////

const { Client } = require("pg");

// If we're running in test "mode", use our test db
// Make sure to create both databases!

// let DB_URI;

// if (process.env.NODE_ENV === "test") {
  // DB_URI = "postgresql:///cpt";
  // DB_URI = 'postgresql://postgres:password@localhost:5432/cpt';
  // DB_URI = 'postgres://ydbtkyjjovdgii:704962b7ca2d22f1311362729c53439949ecfcd339a2254be39b7d9706ad3e63@ec2-54-145-224-156.compute-1.amazonaws.com:5432/d357fss3k147t7';
// } else {
  // DB_URI = "postgresql:///cpt";
  // DB_URI = 'postgresql://postgres:password@localhost:5432/cpt';
  // DB_URI = 'postgres://ydbtkyjjovdgii:704962b7ca2d22f1311362729c53439949ecfcd339a2254be39b7d9706ad3e63@ec2-54-145-224-156.compute-1.amazonaws.com:5432/d357fss3k147t7';
// }

// let db = new Client({
//   connectionString: DB_URI
// });

// Need to specify ssl attribute
var db = new Client({
  user: "ydbtkyjjovdgii",
  password: "704962b7ca2d22f1311362729c53439949ecfcd339a2254be39b7d9706ad3e63",
  database: "d357fss3k147t7",
  port: 5432,
  host: "ec2-54-145-224-156.compute-1.amazonaws.com",
  ssl: { rejectUnauthorized: false }
}); 

db.connect();

module.exports = db;