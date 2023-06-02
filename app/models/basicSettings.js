
const {sql} = require("../config/db.config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const basicSettings = function (basicSettings) {
	this.company_name = basicSettings.company_name;
	this.description = basicSettings.description;
	this.invoice_prefix  = basicSettings.invoice_prefix ;
	this.time_format  = basicSettings.time_format ;
	this.logo = basicSettings.logo;
	this.favourite_icon  = basicSettings.favourite_icon ;

};
basicSettings.create = async (req, res) => {
	sql.query(`CREATE TABLE IF NOT EXISTS public.basic_settings (
        id SERIAL NOT NULL,
		company_name text,
        description text ,
        invoice_prefix  text,
		time_format  text,
		logo  text,
        favourite_icon  text,
        createdAt timestamp ,
        updatedAt timestamp  ,
        PRIMARY KEY (id))  ` , async (err, result) => {
		if (err) {
			res.json({
				message: "Try Again",
				status: false,
				err
			});
		} else {
			if (!req.body.company_name || req.body.company_name === '') {
				res.json({
					message: "Please Enter company name",
					status: false,
				});
			} else {
				let photo = '';
				if (req.files.logo) {
					photo = req.files.logo[0].path;
				}
				let icon = '';
				if (req.files.icon) {
					icon = req.files.icon[0].path;
				}

				const { company_name, description, invoice_prefix ,time_format   } = req.body;
				const query = `INSERT INTO "basic_settings"
				 (id,company_name, description,invoice_prefix ,time_format ,logo ,favourite_icon    ,createdAt ,updatedAt )
                            VALUES (DEFAULT, $1, $2, $3, $4, $5, $6, 'NOW()','NOW()' ) RETURNING * `;
				const foundResult = await sql.query(query,
					[company_name, description, invoice_prefix , time_format , photo, icon  ]);
				if (foundResult.rows.length > 0) {
					if (err) {
						res.json({
							message: "Try Again",
							 status : false,
							err
						});
					}
					else {
						res.json({
							message: "Basic Settings Added Successfully!",
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

basicSettings.viewSpecific = async (req, res) => {
	// const data = await sql.query(`select COUNT(*) AS count from "basicSettingsregistration"
	//  where basicSettings_id = $1`, [req.body.id]);
	sql.query(`select *  from "basic_settings"
	 where id = $1`, [req.body.id], (err, result) => {
		if (err) {
			console.log(err);
			res.json({
				message: "Try Again",
				status : false,
				err
			});
		} else {
			res.json({
				message: "Specific basic Settings Details",
				status : true,
				result: result.rows
			});
		}
	});
}

basicSettings.viewAll = async (req, res) => {
	const data = await sql.query(`SELECT COUNT(*) AS count FROM "basic_settings"`);
	// let limit = '10';
	// let page = req.body.page;
	let result;
	// if (!page || !limit) {
		result = await sql.query(`SELECT * FROM "basic_settings" ORDER BY "createdat" DESC`);
	// }
	// if (page && limit) {
	// 	limit = parseInt(limit);
	// 	let offset = (parseInt(page) - 1) * limit
	// 	result = await sql.query(`SELECT * FROM "basic_settings" ORDER BY "createdat" DESC
	// 	LIMIT $1 OFFSET $2 ` , [limit, offset]);
	// }
	if (result.rows) {
		res.json({
			message: "All basic Settings Details",
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

basicSettings.update  = async (req, res) => {
	if (req.body.id === '') {
		res.json({
			message: "id is required",
			status: false,
		});
	} else {
		const basicSettingsData = await sql.query(`select * from "basic_settings" where id = $1`, [req.body.id]);
		const oldcompany_name = basicSettingsData.rows[0].company_name;
		const olddescription = basicSettingsData.rows[0].description;
		const oldinvoice_prefix  = basicSettingsData.rows[0].invoice_prefix ;
		const oldtime_format  = basicSettingsData.rows[0].time_format ;
		const oldlogo = basicSettingsData.rows[0].logo;
		const oldfavourite_icon  = basicSettingsData.rows[0].favourite_icon ;
		let photo = oldlogo;
		if (req.files.logo) {
			photo = req.files.logo[0].path;
		}
		let icon = oldfavourite_icon;
		if (req.files.icon) {
			icon = req.files.icon[0].path;
		}

		let { id, company_name, description, invoice_prefix ,time_format , logo , favourite_icon    } = req.body;
		if (company_name === undefined || company_name === '') {
			company_name = oldcompany_name;
		}
		if (description === undefined || description === '') {
			description = olddescription;
		}
		if (invoice_prefix  === undefined || invoice_prefix  === '') {
			invoice_prefix  = oldinvoice_prefix ;
		}
		if (time_format  === undefined || time_format  === '') {
            time_format  = oldtime_format ;
        }
		sql.query(`Update  "basic_settings" SET company_name = $1, description = $2, 
		invoice_prefix  = $3, time_format  = $4, logo = $5 , favourite_icon  = $6 WHERE id = $7;`,
			[company_name, description, invoice_prefix , time_format , photo, icon  , id], async (err, result) => {
				if (err) {
					console.log(err);
					res.json({
						message: "Try Again",
						status: false,
						err
					});
				} else {
					if (result.rowCount === 1) {		
						const data = await sql.query(`select * from "basic_settings" where id = $1`, [req.body.id]);
						res.json({
							message: "basic Settings  updated Successfully!",
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


basicSettings.delete = async (req, res) => {
	const data = await sql.query(`select * from "basic_settings" where id = $1`, [req.params.id]);
	if (data.rows.length === 1) {
		sql.query(`DELETE FROM "basic_settings" WHERE id = $1;`, [req.params.id], (err, result) => {
			if (err) {
				res.json({
					message: "Try Again",
					status: false,
					err
				});
			} else {
				res.json({
					message: "basic Settings Deleted Successfully!",
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
module.exports = basicSettings;