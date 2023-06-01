
const { sql } = require("../config/db.config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const MembershipLevel = function (MembershipLevel) {
	this.level = MembershipLevel.level;
};

MembershipLevel.create = async (req, res) => {
	sql.query(`CREATE TABLE IF NOT EXISTS public.membership_level (
        id SERIAL NOT NULL,
		level text,
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
			const { level } = req.body;

			const query = `INSERT INTO "membership_level"
				 (id,level, createdAt ,updatedAt )
                            VALUES (DEFAULT, $1, 'NOW()','NOW()' ) RETURNING * `;
			const foundResult = await sql.query(query,
				[level]);
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
						message: "membership Level Added Successfully!",
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

MembershipLevel.viewSpecific = (req, res) => {
	sql.query(`SELECT * FROM "membership_level" WHERE ( id = $1)`, [req.body.id], (err, result) => {
		if (err) {
			console.log(err);
			res.json({
				message: "Try Again",
				status: false,
				err
			});
		} else {
			res.json({
				message: "membership Level Details",
				status: true,
				result: result.rows
			});
		}
	});
}


MembershipLevel.viewAll = async (req, res) => {
	const Data = await sql.query(`SELECT COUNT(*) AS count FROM "membership_level"`);

	sql.query(`SELECT * FROM "membership_level" `, (err, result) => {
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
				message: "MembershipLevel Details",
				status: true,
				total: Data.rows[0].count,
				result: result.rows
			});
		}
	});
}


MembershipLevel.update = async (req, res) => {
	if (req.body.id === '') {
		res.json({
			message: "id is required",
			status: false,
		});
	} else {
		const MembershipLevelData = await sql.query(`select * from "membership_level" where id = $1`, [req.body.id]);
		const oldlevel = MembershipLevelData.rows[0].level;

		let { level, id } = req.body;

		if (level === undefined || level === '') {
			level = oldlevel;
		}

		sql.query(`UPDATE "membership_level" SET level =  $1 WHERE id = $2`,
			[level,id], async (err, result) => {
					if (err) {
						console.log(err);
						res.json({
							message: "Try Again",
							status: false,
							err
						});
					} else {
						if (result.rowCount === 1) {
							const data = await sql.query(`select * from "membership_level" where id = $1`, [req.body.id]);
							res.json({
								message: "membership Level Updated Successfully!",
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


MembershipLevel.delete = async (req, res) => {
	const data = await sql.query(`select * from "membership_level" where id = $1`, [req.params.id]);
	if (data.rows.length === 1) {
		sql.query(`DELETE FROM "membership_level" WHERE id = $1;`, [req.params.id], (err, result) => {
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
module.exports = MembershipLevel;