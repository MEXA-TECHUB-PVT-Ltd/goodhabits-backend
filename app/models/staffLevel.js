
const { sql } = require("../config/db.config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const staffLevel = function (staffLevel) {
	this.level_name = staffLevel.level_name;
	this.description = staffLevel.description;
	this.telephone = staffLevel.telephone
	this.gender = staffLevel.gender;
	this.review = staffLevel.review;
};

staffLevel.create = async (req, res) => {
	sql.query(`CREATE TABLE IF NOT EXISTS public.staff_level (
        id SERIAL NOT NULL,
		level_name text,
        description text ,
        telephone text,
		gender text,
        review text ,
        createdAt timestamp,
        updatedAt timestamp ,
        PRIMARY KEY (id))  ` , async (err, result) => {
		if (err) {
			res.json({
				message: "Try Again",
				status: false,
				err
			});
		} else {
			const { level_name, description, telephone, gender,
				review } = req.body;

			const query = `INSERT INTO "staff_level"
				 (id,level_name, description,telephone,gender,review 
					  ,createdAt ,updatedAt )
                            VALUES (DEFAULT, $1, $2, $3, $4, $5, 'NOW()','NOW()' ) RETURNING * `;
			const foundResult = await sql.query(query,
				[level_name, description, telephone,
					gender, review]);
			if (foundResult.rows.length > 0) {
				if (err) {
					res.json({
						message: "Try Again",
						status: false,
						err
					});
				}
				else {
					res.json({
						message: "Staff Level Added Successfully!",
						status: true,
						result: foundResult.rows,
					});
				}
			} else {
				res.json({
					message: "Try Again",
					status: false,
					err
				});
			}

		};
	});
}

staffLevel.viewSpecific = (req, res) => {
	sql.query(`SELECT * FROM "staff_level" WHERE ( id = $1)`, [req.body.id], (err, result) => {
		if (err) {
			console.log(err);
			res.json({
				message: "Try Again",
				status: false,
				err
			});
		} else {
			res.json({
				message: "Staff Level Details",
				status: true,
				result: result.rows
			});
		}
	});
}


staffLevel.Report = async (req, res) => {
	// const Data = await sql.query(`SELECT COUNT(*) AS count FROM "staff_level"
	// WHERE 'created_at' = $1 AND created_at = $2`, [req.body.start_date, req.body.end_date]);
	console.log(req.body.start_date);
	console.log( req.body.end_date)
	let start = new Date(req.body.start_date);
	let end = new Date(req.body.end_date)
	console.log(start)
	console.log(end)
	const query = `SELECT createdat FROM "staff_level" WHERE  'createdat' >= $1 AND  'createdat' <= $2`;
const foundResult = await sql.query(query);
	console.log(foundResult.rows)
	sql.query(`SELECT *  FROM "staff_level"
	WHERE  'createdat' >= $1 AND  'createdat' <= $2  `,[start, end], (err, result) => {
		if (err) {
			console.log(err);
			res.json({
				message: "Try Again",
				status: false,
				err
			});
		} else {
			res.json({
				message: "Staff Level Report",
				status: true,
				// total: Data.rows[0].count,
				result: result.rows
			});
		}
	});
}


staffLevel.viewAll = async (req, res) => {
	const Data = await sql.query(`SELECT COUNT(*) AS count FROM "staff_level"`);

	sql.query(`SELECT * FROM "staff_level" `, (err, result) => {
		if (err) {
			console.log(err);
			res.json({
				message: "Try Again",
				status: false,
				err
			});
		} else {
			// for (let i = 0; i < result.rowCount; i++) {
			// 	result.rows[i] = {
			// 		...result.rows[i],
			// 		count: Data.rows[0].count
			// 	}
			// }
			res.json({
				message: "staffLevel Details",
				status: true,
				total: Data.rows[0].count,
				result: result.rows
			});
		}
	});
}


staffLevel.update = async (req, res) => {
	if (req.body.id === '') {
		res.json({
			message: "id is required",
			status: false,
		});
	} else {
		const staffLevelData = await sql.query(`select * from "staff_level" where id = $1`, [req.body.id]);
		const oldlevel_name = staffLevelData.rows[0].level_name;
		const olddescription = staffLevelData.rows[0].description;
		const oldtelephone = staffLevelData.rows[0].telephone;
		const oldgender = staffLevelData.rows[0].gender;
		const oldreview = staffLevelData.rows[0].review;

		let { level_name, description, gender, telephone,
			review, id } = req.body;

		if (level_name === undefined || level_name === '') {
			level_name = oldlevel_name;
		}
		if (telephone === undefined || telephone === '') {
			telephone = oldtelephone;
		}

		if (description === undefined || description === '') {
			description = olddescription;
		}
		if (gender === undefined || gender === '') {
			gender = oldgender;
		}
		if (review === undefined || review === '') {
			review = oldreview;
		}

		sql.query(`UPDATE "staff_level" SET level_name =  $1, 
		description =  $2, 
		telephone  =  $3 , 
		gender =  $4, review =  $5 WHERE id = $6;`,
			[level_name, description, telephone, gender,
				review, id], async (err, result) => {
					if (err) {
						console.log(err);
						res.json({
							message: "Try Again",
							status: false,
							err
						});
					} else {
						if (result.rowCount === 1) {
							const data = await sql.query(`select * from "staff_level" where id = $1`, [req.body.id]);
							res.json({
								message: "Staff Level Updated Successfully!",
								status: true,
								result: data.rows,
							});
						} else if (result.rowCount === 0) {
							res.json({
								message: "Not Found",
								status: false,
							});
						}
					}
				});
	}
}


staffLevel.delete = async (req, res) => {
	const data = await sql.query(`select * from "staff_level" where id = $1`, [req.params.id]);
	if (data.rows.length === 1) {
		sql.query(`DELETE FROM "staff_level" WHERE id = $1;`, [req.params.id], (err, result) => {
			if (err) {
				res.json({
					message: "Try Again",
					status: false,
					err
				});
			} else {
				res.json({
					message: "Customer  Relation Deleted Successfully!",
					status: true,
					result: data.rows,

				});
			}
		});
	} else {
		res.json({
			message: "Not Found",
			status: false,
		});
	}
}
module.exports = staffLevel;