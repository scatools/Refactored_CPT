const express = require('express');
const ExpressError = require('./expressError');
const db = require('./db');
const db_user = require('./db_user');
const cors = require('cors');
const morgan = require('morgan');
const SMAA_MCDA = require('./mcda');
const bcrypt = require('bcryptjs');

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan('tiny'));

app.post('/data', async function(req, res, next) {
	try {
		// Set 4326 as the SRID for both geometries to avoid operations on mixed projections
		const results = await db.query(
			`SELECT gid,objectid,
			hab1,hab2,hab3,hab4,
			wq1,wq2,wq3,wq4,wq5,wq6,
			lcmr1,lcmr2,lcmr3,lcmr4,lcmr5,lcmr6,
			cl1,cl2,cl3,cl4,cl5,
			eco1,eco2,eco3,eco4,
			ST_AsGeoJSON(ST_SetSRID(geom, 4326)) AS geometry 
			FROM sca_landonly_withdata8_renamed 
			WHERE ST_Intersects(ST_SetSRID(ST_GeomFromGeoJSON($1), 4326), ST_SetSRID(sca_landonly_withdata8_renamed.geom, 4326))`,
			[req.body.data]
		);
		
		const hexIDList = results.rows.map((hex) => {return parseInt(hex.objectid)});
		// console.log(hexIDList);
		// Use double quotes if there are capital letters in the column name
		const speciesCode = await db.query(
			`SELECT "SPPCodeNew" 
			FROM te_index 
			WHERE "OBJECTID" IN (`+ hexIDList.toString() +`)`
		);
		// Split and flatten the SPPCodeNew values into segments of 4 characters for the list of species codes
		var speciesCodeList = speciesCode.rows.map((code) => {
			return code.SPPCodeNew.match(/.{4}/g)
		}).flat();
		// Remove the duplicate codes
		speciesCodeList = [...new Set(speciesCodeList)];
		// console.log(speciesCodeList);

		// Use single quotes if there are capital letters in the string values
		const speciesName = await db.query(
			`SELECT "COMNAME" 
			FROM te_name 
			WHERE "SPPCodeNew" IN ('`+ speciesCodeList.join("','") +`')`
		);
		var speciesNameList = speciesName.rows.map((name) => {return name.COMNAME});
		speciesNameList = [...new Set(speciesNameList)];

		return res.json({
			length: results.rows.length,
			data: results.rows,
			speciesCode: speciesCodeList,
			speciesName: speciesNameList
		});
	} catch (e) {
		next(e);
		console.error(e); 
	}
});

app.post('/mcda', async function(req, res, next) {
	try {
		const Init_mean = req.body.mean;
		const Init_std = req.body.std || 0.1;
		const result = await SMAA_MCDA(Init_mean,Init_std);
		return res.json(result);
	} catch (e) {
		next(e);
	}
});

app.get('/report', async function(req, res, next){
	try{
		return res.download('./report_template.html');
	} catch(e) {
		next(e);
	}
})

// Three user-related endpoints: get & post & delete

app.post('/register', async function(req, res, next){
	try{
		var salt = bcrypt.genSaltSync(12);
		var hashed_password = bcrypt.hashSync(req.body.password, salt);
		const result = await db_user.query(
			`INSERT INTO users(username, password, email, first_name, last_name, is_admin)
			VALUES ($1, $2, $3, $4, $5, $6)`,
			[
				req.body.username,
				hashed_password,
				req.body.email,
				req.body.first_name,
				req.body.last_name,
				req.body.is_admin
			]
		);
		return res.json(result);
	} catch(e) {
		next(e);
	}
})

app.post('/login', async function(req, res, next){
	try{
		const result = await db_user.query(
			`SELECT password
			FROM users
			WHERE username = $1`,
			[req.body.username]
		);
		var validLogin = false;
		if (result.rows.length !== 0) {
			validLogin = bcrypt.compareSync(req.body.password, result.rows[0].password);
		};
		return res.json({
			credentials: result.rows,
			validLogin: validLogin
		});
	} catch(e) {
		next(e);
	}
})

app.post('/user', async function(req, res, next){
	try{
		const result = await db_user.query(
			`SELECT username, email, first_name, last_name, is_admin
			FROM users
			WHERE username = $1`,
			[req.body.username]
		);
		return res.json(result);
	} catch(e) {
		next(e);
	}
})

/** general error handler */

app.use(function(req, res, next) {
	const err = new ExpressError('Not Found', 404);

	// pass err to the next middleware
	return next(err);
});

app.use(function(err, req, res, next) {
	// the default status is 500 Internal Server Error
	let status = err.status || 500;

	// set the status and alert the user
	return res.status(status).json({
		error: {
			message: err.message,
			status: status
		}
	});
});

module.exports = app;
