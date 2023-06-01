
const {sql} = require("../config/db.config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const EmailSettings = function (EmailSettings) {
	this.mail_driver = EmailSettings.mail_driver;
	this.mail_host = EmailSettings.mail_host;
	this.mail_port = EmailSettings.mail_port;
	this.mail_username = EmailSettings.mail_username;
	this.mail_password = EmailSettings.mail_password;
	this.mail_encryption = EmailSettings.mail_encryption;
	this.mail_from_address = EmailSettings.mail_from_address;
	this.mail_from_name = EmailSettings.mail_from_name;

};
EmailSettings.create = async (req, res) => {
	sql.query(`CREATE TABLE IF NOT EXISTS public.email_settings (
        id SERIAL NOT NULL,
		mail_driver text,
        mail_host text ,
        mail_port text,
		mail_username text,
		mail_password text ,
        mail_encryption text,
		mail_from_address text,
		mail_from_name text,
        createdAt timestamp,
        updatedAt timestamp ,
        PRIMARY KEY (id)) ` , async (err, result) => {
		if (err) {
			res.json({
				message: "Try Again",
				status: false,
				err
			});
		} else {
			if (!req.body.mail_driver || req.body.mail_driver === '') {
				res.json({
					message: "Please Enter mail_driver",
					status: false,
				});
			} else {
				const { mail_driver, mail_host, mail_port,mail_username ,mail_password, 
					mail_encryption, mail_from_address, mail_from_name } = req.body;
				const query = `INSERT INTO "email_settings"
				 (id,mail_driver, mail_host,mail_port,mail_username,mail_password ,mail_encryption , mail_from_address,mail_from_name ,createdAt ,updatedAt )
                            VALUES (DEFAULT, $1, $2, $3, $4, $5, $6, $7, $8, 'NOW()','NOW()' ) RETURNING * `;
				const foundResult = await sql.query(query,
					[mail_driver, mail_host, mail_port, mail_username, mail_password, mail_encryption, mail_from_address, mail_from_name]);
				if (foundResult.rows.length > 0) {
					if (err) {
						res.json({
							message: "Try Again",
							mail_from_address: false,
							err
						});
					}
					else {
						res.json({
							message: "Email Settings Added Successfully!",
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
		}

	});
}	
EmailSettings.viewSpecific = (req, res) => {
	sql.query(`SELECT * FROM "email_settings" WHERE ( id = $1)`, [req.body.id], (err, result) => {
		if (err) {
			console.log(err);
			res.json({
				message: "Try Again",
				mail_from_address: false,
				err
			});
		} else {
			res.json({
				message: "Email Settings Details",
				mail_from_address: true,
				result: result.rows
			});
		}
	});
}
EmailSettings.viewAll = async (req, res) => {
	const data = await sql.query(`SELECT COUNT(*) AS count FROM "email_settings"`);
	// let limit = '10';
	// let page = req.body.page;
	let result;
	// if (!page || !limit) {
		result = await sql.query(`SELECT * FROM "email_settings" ORDER BY "createdat" DESC`);
	// }
	// if (page && limit) {
	// 	limit = parseInt(limit);
	// 	let offset = (parseInt(page) - 1) * limit
	// 	result = await sql.query(`SELECT * FROM "email_settings" ORDER BY "createdat" DESC
	// 	LIMIT $1 OFFSET $2 ` , [limit, offset]);
	// }
	if (result.rows) {
		res.json({
			message: "Email Settings Details",
			status: true,
			count: data.rows[0].count,
			result: result.rows,
		});
	} else {
		res.json({
			message: "could not fetch",
			status: false
		})
	}
}
EmailSettings.update = async (req, res) => {
	if (req.body.id === '') {
		res.json({
			message: "id is required",
			status: false,
		});
	} else {
		const EmailSettingsData = await sql.query(`select * from "email_settings" where id = $1`, [req.body.id]);
		const oldmail_driver = EmailSettingsData.rows[0].mail_driver;
		const oldmail_host = EmailSettingsData.rows[0].mail_host;
		const oldmail_port = EmailSettingsData.rows[0].mail_port;
		const oldmail_username = EmailSettingsData.rows[0].mail_username;
		const oldmail_password = EmailSettingsData.rows[0].mail_password;
		const oldmail_encryption = EmailSettingsData.rows[0].mail_encryption;
		const oldmail_from_address = EmailSettingsData.rows[0].mail_from_address;
		const oldmail_from_name = EmailSettingsData.rows[0].mail_from_name;
		let { id, mail_driver, mail_host, mail_port,mail_username, mail_password , mail_encryption, mail_from_address , mail_from_name} = req.body;
		if (mail_driver === undefined || mail_driver === '') {
			mail_driver = oldmail_driver;
		}
		if (mail_host === undefined || mail_host === '') {
			mail_host = oldmail_host;
		}
		if (mail_port === undefined || mail_port === '') {
			mail_port = oldmail_port;
		}
		if (mail_username === undefined || mail_username === '') {
            mail_username = oldmail_username;
        }
		if (mail_password === undefined || mail_password === '') {
			mail_password = oldmail_password;
		}
		if (mail_encryption === undefined || mail_encryption === '') {
            mail_encryption = oldmail_encryption;
        }
		if (mail_from_address === undefined || mail_from_address === '') {
            mail_from_address = oldmail_from_address;
        }
		if (mail_from_name === undefined || mail_from_name === '') {
            mail_from_name = oldmail_from_name;
        }
		sql.query(`UPDATE "email_settings" SET mail_driver = $1, mail_host = $2, 
		mail_port = $3, mail_username = $4, mail_password = $5 , mail_encryption = $6,
		mail_from_address = $7, mail_from_name = $8  WHERE id = $9;`,
			[mail_driver, mail_host, mail_port, mail_username, mail_password, mail_encryption, mail_from_address ,mail_from_name, id], async (err, result) => {
				if (err) {
					console.log(err);
					res.json({
						message: "Try Again",
						status: false,
						err
					});
				} else {
					if (result.rowCount === 1) {		
						const data = await sql.query(`select * from "email_settings" where id = $1`, [req.body.id]);
						res.json({
							message: "Email Settings Updated Successfully!",
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
EmailSettings.delete = async (req, res) => {
	const data = await sql.query(`select * from "email_settings" where id = $1`, [req.params.id]);
	if (data.rows.length === 1) {
		sql.query(`DELETE FROM "email_settings" WHERE id = $1;`, [req.params.id], (err, result) => {
			if (err) {
				res.json({
					message: "Try Again",
					status: false,
					err
				});
			} else {
				res.json({
					message: "Email Settings Deleted Successfully!",
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
module.exports = EmailSettings;