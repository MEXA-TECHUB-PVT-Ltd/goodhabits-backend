
const {sql} = require("../config/db.config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const donationRecord = function (donationRecord) {
	this.parent_id = donationRecord.parent_id;
	this.full_name = donationRecord.full_name;
	this.call = donationRecord.call;
	this.telephone = donationRecord.telephone;
	this.donation_method = donationRecord.donation_method;
	this.donation_amount = donationRecord.donation_amount;
	this.donation_date = donationRecord.donation_date;
	this.principal = donationRecord.principal;

};
donationRecord.create = async (req, res) => {
	sql.query(`CREATE TABLE IF NOT EXISTS public.donation_record (
        id SERIAL NOT NULL,
		parent_id SERIAL NOT NULL,
        full_name text ,
        call text,
		telephone text,
		donation_method text ,
        donation_amount text,
		donation_date text,
		principal text,
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
			if (!req.body.parent_id || req.body.parent_id === '') {
				res.json({
					message: "Please Enter parent_id",
					status: false,
				});
			} else {
				const { parent_id, full_name, call,telephone ,donation_method, 
					donation_amount, donation_date, principal } = req.body;
				const query = `INSERT INTO "donation_record"
				 (id,parent_id, full_name,call,telephone,donation_method ,donation_amount , donation_date,principal ,createdAt ,updatedAt )
                            VALUES (DEFAULT, $1, $2, $3, $4, $5, $6, $7, $8, 'NOW()','NOW()' ) RETURNING * `;
				const foundResult = await sql.query(query,
					[parent_id, full_name, call, telephone, donation_method, donation_amount, donation_date, principal]);
				if (foundResult.rows.length > 0) {
					if (err) {
						res.json({
							message: "Try Again",
							donation_date: false,
							err
						});
					}
					else {
						res.json({
							message: "Donation Record Added Successfully!",
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
donationRecord.viewSpecific = (req, res) => {
	sql.query(`SELECT * FROM "donation_record" WHERE ( id = $1)`, [req.body.id], (err, result) => {
		if (err) {
			console.log(err);
			res.json({
				message: "Try Again",
				donation_date: false,
				err
			});
		} else {
			res.json({
				message: "Donation Record Details",
				donation_date: true,
				result: result.rows
			});
		}
	});
}
donationRecord.viewAll = async (req, res) => {
	const data = await sql.query(`SELECT COUNT(*) AS count FROM "donation_record"`);
	// let limit = '10';
	// let page = req.body.page;
	let result;
	// if (!page || !limit) {
		result = await sql.query(`SELECT * FROM "donation_record" ORDER BY "createdat" DESC`);
	// }
	// if (page && limit) {
	// 	limit = parseInt(limit);
	// 	let offset = (parseInt(page) - 1) * limit
	// 	result = await sql.query(`SELECT * FROM "donation_record" ORDER BY "createdat" DESC
	// 	LIMIT $1 OFFSET $2 ` , [limit, offset]);
	// }
	if (result.rows) {
		res.json({
			message: "donationRecord Details",
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
donationRecord.update = async (req, res) => {
	if (req.body.id === '') {
		res.json({
			message: "id is required",
			status: false,
		});
	} else {
		const donationRecordData = await sql.query(`select * from "donation_record" where id = $1`, [req.body.id]);
		const oldparent_id = donationRecordData.rows[0].parent_id;
		const oldfull_name = donationRecordData.rows[0].full_name;
		const oldcall = donationRecordData.rows[0].call;
		const oldtelephone = donationRecordData.rows[0].telephone;
		const olddonation_method = donationRecordData.rows[0].donation_method;
		const olddonation_amount = donationRecordData.rows[0].donation_amount;
		const olddonation_date = donationRecordData.rows[0].donation_date;
		const oldprincipal = donationRecordData.rows[0].principal;
		let { id, parent_id, full_name, call,telephone, donation_method , donation_amount, donation_date , principal} = req.body;
		if (parent_id === undefined || parent_id === '') {
			parent_id = oldparent_id;
		}
		if (full_name === undefined || full_name === '') {
			full_name = oldfull_name;
		}
		if (call === undefined || call === '') {
			call = oldcall;
		}
		if (telephone === undefined || telephone === '') {
            telephone = oldtelephone;
        }
		if (donation_method === undefined || donation_method === '') {
			donation_method = olddonation_method;
		}
		if (donation_amount === undefined || donation_amount === '') {
            donation_amount = olddonation_amount;
        }
		if (donation_date === undefined || donation_date === '') {
            donation_date = olddonation_date;
        }
		if (principal === undefined || principal === '') {
            principal = oldprincipal;
        }
		sql.query(`UPDATE "donation_record" SET parent_id = $1, full_name = $2, 
		call = $3, telephone = $4, donation_method = $5 , donation_amount = $6,
		donation_date = $7, principal = $8  WHERE id = $9;`,
			[parent_id, full_name, call, telephone, donation_method, donation_amount, donation_date ,principal, id], async (err, result) => {
				if (err) {
					console.log(err);
					res.json({
						message: "Try Again",
						status: false,
						err
					});
				} else {
					if (result.rowCount === 1) {		
						const data = await sql.query(`select * from "donation_record" where id = $1`, [req.body.id]);
						res.json({
							message: "Donation Record Updated Successfully!",
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
donationRecord.delete = async (req, res) => {
	const data = await sql.query(`select * from "donation_record" where id = $1`, [req.params.id]);
	if (data.rows.length === 1) {
		sql.query(`DELETE FROM "donation_record" WHERE id = $1;`, [req.params.id], (err, result) => {
			if (err) {
				res.json({
					message: "Try Again",
					status: false,
					err
				});
			} else {
				res.json({
					message: "Donation Record Deleted Successfully!",
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
module.exports = donationRecord;