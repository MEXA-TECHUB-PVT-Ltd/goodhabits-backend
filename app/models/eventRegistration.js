
const { sql } = require("../config/db.config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const eventRegistration = function (eventRegistration) {
	this.event_id = eventRegistration.event_id;
	this.participation_date = eventRegistration.participation_date;
	this.participation_time = eventRegistration.participation_time;
	this.parent_id = eventRegistration.parent_id;
	this.full_name = eventRegistration.full_name;
	this.telephone = eventRegistration.telephone;
	this.payment_date = eventRegistration.payment_date;
	this.payment_method = eventRegistration.payment_method;

	this.payment_amount = eventRegistration.payment_amount;
	this.payee = eventRegistration.payee;
	this.payment_status = eventRegistration.payment_status;
	this.remarks = eventRegistration.remarks;

};
eventRegistration.registration = async (req, res) => {
	sql.query(`CREATE TABLE IF NOT EXISTS public.eventregistration (
        id SERIAL NOT NULL,
		event_id SERIAL NOT NULL,
        participation_date text ,
        participation_time text,
		parent_id SERIAL NOT NULL,
		full_name text ,
        telephone text,
		call text,
		payment_date text,
		payment_method text,
		payment_amount text,
		payee text,
		payment_status text,
		remarks text,
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
			if (!req.body.event_id || req.body.event_id === '') {
				res.json({
					message: "Please Enter event_id",
					status: false,
				});
			} else {
				const { event_id, participation_date, participation_time, parent_id, full_name,
					telephone, call,payment_date, payment_method, payment_amount,
					payee,
					payment_status,
					remarks } = req.body;
				const query = `INSERT INTO "eventregistration"
				 (id,event_id, participation_date,participation_time,parent_id,full_name ,telephone,call , payment_date,payment_method,payment_amount ,
					payee ,
					payment_status ,
					remarks ,createdAt ,updatedAt )
                            VALUES (DEFAULT, $1, $2, $3, $4, $5, $6, $7, $8,$9,$10,$11,$12,$13, 'NOW()','NOW()' ) RETURNING * `;
				const foundResult = await sql.query(query,
					[event_id, participation_date, participation_time, parent_id, full_name, telephone,call, payment_date, payment_method, payment_amount,
						payee,
						payment_status,
						remarks]);
				if (foundResult.rows.length > 0) {
					if (err) {
						res.json({
							message: "Try Again",
							payment_date: false,
							err
						});
					}
					else {
						res.json({
							message: "Event registed Successfully!",
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

eventRegistration.ChargeRecord = async (req, res)=>{
		// const Data = await sql.query(`SELECT COUNT(*) AS count FROM "customer_relation"
	// WHERE 'created_at' = $1 AND created_at = $2`, [req.body.start_date, req.body.end_date]);
// 	const query = `SELECT createdat FROM "eventregistration" WHERE  'createdat' >= $1 AND  'createdat' <= $2`;
// const foundResult = await sql.query(query,[start, end]);
// 	console.log(foundResult.rows)

	console.log(req.body.minimum_date);
	console.log( req.body.maximum_date)
	let start = new Date(req.body.minimum_date);
	let end = new Date(req.body.maximum_date)
	console.log(start)
	console.log(end)
	sql.query(`SELECT "eventregistration".parent_id,  "eventregistration".full_name, "eventregistration".telephone,
	"eventregistration".payment_date,"eventregistration".payment_status,"event".id AS event_id, "event".name FROM "eventregistration" JOIN 
	"event" ON "eventregistration".event_id = "event".id
	WHERE  "eventregistration".createdat >= $1 AND "eventregistration".createdat <= $2  `,[start,end], (err, result) => {
		if (err) {
			console.log(err);
			res.json({
				message: "Try Again",
				status: false,
				err
			});
		} else {
			console.log(result.rowCount);
			res.json({
				message: "Event Registration in Between ",
				status: true,
				// total: Data.rows[0].count,
				result: result.rows
			});
		}
	});

}

eventRegistration.viewAllRegistration = async (req, res) => {
	const data = await sql.query(`SELECT COUNT(*) AS count FROM "eventregistration" WHERE event_id = $1`,[req.body.id]);
	// let limit = '10';
	// let page = req.body.page;
	let result;
	// if (!page || !limit) {
		result = await sql.query(`SELECT * FROM "eventregistration" WHERE event_id = $1
		 ORDER BY "createdat" DESC`,[req.body.id]);
	// }
	// if (page && limit) {
	// 	limit = parseInt(limit);
	// 	let offset = (parseInt(page) - 1) * limit
	// 	result = await sql.query(`SELECT * FROM "event" ORDER BY "createdat" DESC
	// 	LIMIT $1 OFFSET $2 ` , [limit, offset]);
	// }
	if (result.rows) {
		res.json({
			message: "All Event Details",
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



module.exports = eventRegistration;