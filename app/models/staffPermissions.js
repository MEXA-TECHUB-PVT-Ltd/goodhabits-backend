
const {sql} = require("../config/db.config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const staffPermissions  = function (staffPermissions ) {
	this.level_name = staffPermissions.level_name;
	this.description = staffPermissions.description;
	this.permission_id  = staffPermissions.permission_id ;

};
staffPermissions.create = async (req, res) => {
	sql.query(`CREATE TABLE IF NOT EXISTS public.staff_permissions  (
        id SERIAL NOT NULL,
		level_name text,
        description text ,
        permission_id  text,
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
			if (!req.body.level_name || req.body.level_name === '') {
				res.json({
					message: "Please Enter Module name",
					status: false,
				});
			} else {
				const { level_name, description, permission_id  } = req.body;
				const query = `INSERT INTO "staff_permissions"
				 (id,level_name, description,permission_id   ,createdAt ,updatedAt )
                            VALUES (DEFAULT, $1, $2, $3, 'NOW()','NOW()' ) RETURNING * `;
				const foundResult = await sql.query(query,
					[level_name, description, permission_id  ]);
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
							message: "staff Permissions Added Successfully!",
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

staffPermissions.viewSpecific = async (req, res) => {
	// const data = await sql.query(`select COUNT(*) AS count from "staffPermissions registration"
	//  where staffPermissions _id = $1`, [req.body.id]);
	sql.query(`select *  from "staff_permissions"
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
				message: "Specific staff Permissions   Details",
				status : true,
				result: result.rows
			});
		}
	});
}

staffPermissions.viewAll = async (req, res) => {
	const data = await sql.query(`SELECT COUNT(*) AS count FROM "staff_permissions"`);
	// let limit = '10';
	// let page = req.body.page;
	let result;
	// if (!page || !limit) {
		result = await sql.query(`SELECT * FROM "staff_permissions" ORDER BY "createdat" DESC`);
	// }
	// if (page && limit) {
	// 	limit = parseInt(limit);
	// 	let offset = (parseInt(page) - 1) * limit
	// 	result = await sql.query(`SELECT * FROM "staff_permissions" ORDER BY "createdat" DESC
	// 	LIMIT $1 OFFSET $2 ` , [limit, offset]);
	// }
	if (result.rows) {
		res.json({
			message: "staff Permissions   Details",
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

staffPermissions.update  = async (req, res) => {
	if (req.body.id === '') {
		res.json({
			message: "id is required",
			status: false,
		});
	} else {
		const staffPermissionsData = await sql.query(`select * from "staff_permissions" where id = $1`, [req.body.id]);
		const oldlevel_name = staffPermissionsData.rows[0].level_name;
		const olddescription = staffPermissionsData.rows[0].description;
		const oldpermission_id  = staffPermissionsData.rows[0].permission_id ;

		let { id, level_name, description, permission_id} = req.body;
		if (level_name === undefined || level_name === '') {
			level_name = oldlevel_name;
		}
		if (description === undefined || description === '') {
			description = olddescription;
		}
		if (permission_id  === undefined || permission_id  === '') {
			permission_id  = oldpermission_id ;
		}

		sql.query(`Update  "staff_permissions" SET level_name = $1, description = $2, 
		permission_id  = $3 WHERE id = $4;`,
			[level_name, description, permission_id  , id], async (err, result) => {
				if (err) {
					console.log(err);
					res.json({
						message: "Try Again",
						status: false,
						err
					});
				} else {
					if (result.rowCount === 1) {		
						const data = await sql.query(`select * from "staff_permissions" where id = $1`, [req.body.id]);
						res.json({
							message: "staff Permissions  updated Successfully!",
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


staffPermissions.delete = async (req, res) => {
	const data = await sql.query(`select * from "staff_permissions" where id = $1`, [req.params.id]);
	if (data.rows.length === 1) {
		sql.query(`DELETE FROM "staff_permissions" WHERE id = $1;`, [req.params.id], (err, result) => {
			if (err) {
				res.json({
					message: "Try Again",
					status: false,
					err
				});
			} else {
				res.json({
					message: "staff Permissions Deleted Successfully!",
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
module.exports = staffPermissions ;