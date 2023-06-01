
const {sql} = require("../config/db.config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Permissions = function (Permissions) {
	this.module_name = Permissions.module_name;
	this.add = Permissions.add;
	this.view  = Permissions.view ;
	this.update  = Permissions.update ;
	this.delete = Permissions.delete;

};
Permissions.create = async (req, res) => {
	sql.query(`CREATE TABLE IF NOT EXISTS public.permissions (
        id SERIAL NOT NULL,
		module_name text,
        add text ,
        view  text,
		update  text,
		delete  text,
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
			if (!req.body.module_name || req.body.module_name === '') {
				res.json({
					message: "Please Enter Module name",
					status: false,
				});
			} else {
				const { module_name, add, view ,update ,Delete  } = req.body;
				const query = `INSERT INTO "permissions"
				 (id,module_name, add,view ,update ,delete ,createdAt ,updatedAt )
                            VALUES (DEFAULT, $1, $2, $3, $4, $5, 'NOW()','NOW()' ) RETURNING * `;
				const foundResult = await sql.query(query,
					[module_name, add, view , update , Delete  ]);
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
							message: "permissions  Added Successfully!",
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

Permissions.viewSpecific = async (req, res) => {
	// const data = await sql.query(`select COUNT(*) AS count from "Permissionsregistration"
	//  where Permissions_id = $1`, [req.body.id]);
	sql.query(`select *  from "permissions"
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
				message: "Specific permissions  Details",
				status : true,
				result: result.rows
			});
		}
	});
}

Permissions.viewAll = async (req, res) => {
	const data = await sql.query(`SELECT COUNT(*) AS count FROM "permissions"`);
	// let limit = '10';
	// let page = req.body.page;
	let result;
	// if (!page || !limit) {
		result = await sql.query(`SELECT * FROM "permissions" ORDER BY "createdat" DESC`);
	// }
	// if (page && limit) {
	// 	limit = parseInt(limit);
	// 	let offset = (parseInt(page) - 1) * limit
	// 	result = await sql.query(`SELECT * FROM "permissions" ORDER BY "createdat" DESC
	// 	LIMIT $1 OFFSET $2 ` , [limit, offset]);
	// }
	if (result.rows) {
		res.json({
			message: "All permissions  Details",
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

Permissions.update  = async (req, res) => {
	if (req.body.id === '') {
		res.json({
			message: "id is required",
			status: false,
		});
	} else {
		const PermissionsData = await sql.query(`select * from "permissions" where id = $1`, [req.body.id]);
		const oldmodule_name = PermissionsData.rows[0].module_name;
		const oldadd = PermissionsData.rows[0].add;
		const oldview  = PermissionsData.rows[0].view ;
		const oldupdate  = PermissionsData.rows[0].update ;
		const olddelete = PermissionsData.rows[0].delete;

		let { id, module_name, add, view ,update , Delete} = req.body;
		if (module_name === undefined || module_name === '') {
			module_name = oldmodule_name;
		}
		if (add === undefined || add === '') {
			add = oldadd;
		}
		if (view  === undefined || view  === '') {
			view  = oldview ;
		}
		if (update  === undefined || update  === '') {
            update  = oldupdate ;
        }
		if (Delete  === undefined || Delete  === '') {
            Delete  = olddelete ;
        }

		sql.query(`Update  "permissions" SET module_name = $1, add = $2, 
		view  = $3, update  = $4, delete = $5  WHERE id = $6;`,
			[module_name, add, view , update , Delete  , id], async (err, result) => {
				if (err) {
					console.log(err);
					res.json({
						message: "Try Again",
						status: false,
						err
					});
				} else {
					if (result.rowCount === 1) {		
						const data = await sql.query(`select * from "permissions" where id = $1`, [req.body.id]);
						res.json({
							message: "permissions updated Successfully!",
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


Permissions.delete = async (req, res) => {
	const data = await sql.query(`select * from "permissions" where id = $1`, [req.params.id]);
	if (data.rows.length === 1) {
		sql.query(`DELETE FROM "permissions" WHERE id = $1;`, [req.params.id], (err, result) => {
			if (err) {
				res.json({
					message: "Try Again",
					status: false,
					err
				});
			} else {
				res.json({
					message: "permissions  Deleted Successfully!",
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
module.exports = Permissions;