
const { sql } = require("../config/db.config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const CustomerRelation = function (CustomerRelation) {
	this.full_name = CustomerRelation.full_name;
	this.call = CustomerRelation.call;
	this.telephone = CustomerRelation.telephone
	this.gender = CustomerRelation.gender;
	this.review = CustomerRelation.review;
};

CustomerRelation.create = async (req, res) => {
	sql.query(`CREATE TABLE IF NOT EXISTS public.customer_relation (
        id SERIAL NOT NULL,
		full_name text,
        call text ,
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
			const { full_name, call, telephone, gender,
				review } = req.body;

			const query = `INSERT INTO "customer_relation"
				 (id,full_name, call,telephone,gender,review 
					  ,createdAt ,updatedAt )
                            VALUES (DEFAULT, $1, $2, $3, $4, $5, 'NOW()','NOW()' ) RETURNING * `;
			const foundResult = await sql.query(query,
				[full_name, call, telephone,
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
						message: "Customer Relation Added Successfully!",
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

CustomerRelation.viewSpecific = (req, res) => {
	sql.query(`SELECT * FROM "customer_relation" WHERE ( id = $1)`, [req.body.id], (err, result) => {
		if (err) {
			console.log(err);
			res.json({
				message: "Try Again",
				status: false,
				err
			});
		} else {
			res.json({
				message: "Customer Relation Details",
				status: true,
				result: result.rows
			});
		}
	});
}


CustomerRelation.Report = async (req, res) => {
	// const Data = await sql.query(`SELECT COUNT(*) AS count FROM "customer_relation"
	// WHERE 'created_at' = $1 AND created_at = $2`, [req.body.start_date, req.body.end_date]);
	console.log(req.body.start_date);
	console.log( req.body.end_date)
	let start = new Date(req.body.start_date);
	let end = new Date(req.body.end_date)
	console.log(start)
	console.log(end)
// 	const query = `SELECT createdat FROM "customer_relation" WHERE  'createdat' >= $1 AND  'createdat' <= $2`;
// const foundResult = await sql.query(query);
// 	console.log(foundResult.rows)
	sql.query(`SELECT *  FROM "customer_relation"
	WHERE  createdat >= $1 AND  createdat <= $2  `,[start, end], (err, result) => {
		if (err) {
			console.log(err);
			res.json({
				message: "Try Again",
				status: false,
				err
			});
		} else {
			res.json({
				message: "Customer Relation Report",
				status: true,
				// total: Data.rows[0].count,
				result: result.rows
			});
		}
	});
}


CustomerRelation.viewAll = async (req, res) => {
	const Data = await sql.query(`SELECT COUNT(*) AS count FROM "customer_relation"`);

	sql.query(`SELECT * FROM "customer_relation" `, (err, result) => {
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
				message: "CustomerRelation Details",
				status: true,
				total: Data.rows[0].count,
				result: result.rows
			});
		}
	});
}


CustomerRelation.update = async (req, res) => {
	if (req.body.id === '') {
		res.json({
			message: "id is required",
			status: false,
		});
	} else {
		const CustomerRelationData = await sql.query(`select * from "customer_relation" where id = $1`, [req.body.id]);
		const oldfull_name = CustomerRelationData.rows[0].full_name;
		const oldcall = CustomerRelationData.rows[0].call;
		const oldtelephone = CustomerRelationData.rows[0].telephone;
		const oldgender = CustomerRelationData.rows[0].gender;
		const oldreview = CustomerRelationData.rows[0].review;

		let { full_name, call, gender, telephone,
			review, id } = req.body;

		if (full_name === undefined || full_name === '') {
			full_name = oldfull_name;
		}
		if (telephone === undefined || telephone === '') {
			telephone = oldtelephone;
		}

		if (call === undefined || call === '') {
			call = oldcall;
		}
		if (gender === undefined || gender === '') {
			gender = oldgender;
		}
		if (review === undefined || review === '') {
			review = oldreview;
		}

		sql.query(`UPDATE "customer_relation" SET full_name =  $1, 
		call =  $2, 
		telephone  =  $3 , 
		gender =  $4, review =  $5 WHERE id = $6;`,
			[full_name, call, telephone, gender,
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
							const data = await sql.query(`select * from "customer_relation" where id = $1`, [req.body.id]);
							res.json({
								message: "Customer Relation Updated Successfully!",
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


CustomerRelation.delete = async (req, res) => {
	const data = await sql.query(`select * from "customer_relation" where id = $1`, [req.params.id]);
	if (data.rows.length === 1) {
		sql.query(`DELETE FROM "customer_relation" WHERE id = $1;`, [req.params.id], (err, result) => {
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
module.exports = CustomerRelation;