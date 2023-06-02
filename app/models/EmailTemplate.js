
const { sql } = require("../config/db.config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const EmailTemplate = function (EmailTemplate) {
	this.features = EmailTemplate.features;
};

EmailTemplate.create = async (req, res) => {
	sql.query(`CREATE TABLE IF NOT EXISTS public.email_template (
        id SERIAL NOT NULL,
		features text[],
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
			const { features } = req.body;

			const query = `INSERT INTO "email_template"
				 (id,features,createdAt ,updatedAt )
                            VALUES (DEFAULT, $1, 'NOW()','NOW()' ) RETURNING * `;
			const foundResult = await sql.query(query,
				[features]);
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
						message: "Email Template Added Successfully!",
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

EmailTemplate.viewSpecific = (req, res) => {
	sql.query(`SELECT * FROM "email_template" WHERE ( id = $1)`, [req.body.id], (err, result) => {
		if (err) {
			console.log(err);
			res.json({
				message: "Try Again",
				status: false,
				err
			});
		} else {
			res.json({
				message: "Email Template Details",
				status: true,
				result: result.rows
			});
		}
	});
}


EmailTemplate.viewAll = async (req, res) => {
	const Data = await sql.query(`SELECT COUNT(*) AS count FROM "email_template"`);

	sql.query(`SELECT * FROM "email_template" `, (err, result) => {
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
				message: "EmailTemplate Details",
				status: true,
				total: Data.rows[0].count,
				result: result.rows
			});
		}
	});
}


EmailTemplate.update = async (req, res) => {
	if (req.body.id === '') {
		res.json({
			message: "id is required",
			status: false,
		});
	} else {
		const EmailTemplateData = await sql.query(`select * from "email_template" where id = $1`, [req.body.id]);
		const oldfeatures = EmailTemplateData.rows[0].features;

		let { features, id } = req.body;

		if (features === undefined || features === '') {
			features = oldfeatures;
		}

		sql.query(`UPDATE "email_template" SET features =  $1 WHERE id = $2;`,
			[features,id], async (err, result) => {
					if (err) {
						console.log(err);
						res.json({
							message: "Try Again",
							status: false,
							err
						});
					} else {
						if (result.rowCount === 1) {
							const data = await sql.query(`select * from "email_template" where id = $1`, [req.body.id]);
							res.json({
								message: "Email Template Updated Successfully!",
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


EmailTemplate.delete = async (req, res) => {
	const data = await sql.query(`select * from "email_template" where id = $1`, [req.params.id]);
	if (data.rows.length === 1) {
		sql.query(`DELETE FROM "email_template" WHERE id = $1;`, [req.params.id], (err, result) => {
			if (err) {
				res.json({
					message: "Try Again",
					status: false,
					err
				});
			} else {
				res.json({
					message: "Email Template Deleted Successfully!",
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
module.exports = EmailTemplate;