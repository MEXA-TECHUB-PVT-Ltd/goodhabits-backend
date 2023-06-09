
const {sql} = require("../config/db.config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fastcsv = require("fast-csv");
const fs = require("fs");

const event = function (event) {
	this.name = event.name;
	this.location = event.location;
	this.date = event.date;
	this.time = event.time;
	this.deadline = event.deadline;
	this.activity_cost = event.activity_cost;
	this.payment_date = event.payment_date;

};
event.create = async (req, res) => {
	sql.query(`CREATE TABLE IF NOT EXISTS public.event (
        id SERIAL NOT NULL,
		name text,
        location text ,
        date text,
		time text,
		deadline timestamp ,
        activity_cost text,
		payment_date text,
		event_status  text,
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
			if (!req.body.name || req.body.name === '') {
				res.json({
					message: "Please Enter Event name",
					status: false,
				});
			} else {
				const { name, location, date,time ,deadline, 
					activity_cost, payment_date,event_status  } = req.body;
					const deadLine  = new Date(deadline);
				const query = `INSERT INTO "event"
				 (id,name, location,date,time,deadline ,activity_cost , payment_date,event_status ,createdAt ,updatedAt )
                            VALUES (DEFAULT, $1, $2, $3, $4, $5, $6, $7, 'NOW()','NOW()' ) RETURNING * `;
				const foundResult = await sql.query(query,
					[name, location, date, time, deadLine, activity_cost, payment_date,event_status ]);
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
							message: "Event Added Successfully!",
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

event.viewSpecific = async (req, res) => {
	const data = await sql.query(`select COUNT(*) AS count from "eventregistration"
	 where event_id = $1`, [req.body.id]);
	sql.query(`SELECT "event".* , "eventregistration".full_name, "eventregistration".telephone,
	 "eventregistration".payment_status, "eventregistration".parent_id FROM "event" JOIN "eventregistration" ON 
	  "event".id = "eventregistration".event_id WHERE "event".id = $1`, [req.body.id], (err, result) => {
		if (err) {
			console.log(err);
			res.json({
				message: "Try Again",
				payment_date: false,
				err
			});
		} else {
			res.json({
				message: "Specific Event Details",
				payment_date: true,
				registed_people: data.rows[0].count,
				result: result.rows
			});
		}
	});
}

event.viewAll = async (req, res) => {
	const data = await sql.query(`SELECT COUNT(*) AS count FROM "event"`);
	// let limit = '10';
	// let page = req.body.page;
	let result;
	// if (!page || !limit) {
		result = await sql.query(`SELECT * FROM "event" ORDER BY "createdat" DESC`);
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
event.exportEvent = async (req, res) => {
	const Data = await sql.query(`SELECT COUNT(*) AS count FROM "event"`);
	sql.query(`SELECT * FROM "event" `, (err, result) => {
		if (err) {
			console.log(err);
			res.json({
				message: "Try Again",
				status: false,
				err
			});
		} else {
			const jsonData = JSON.parse(JSON.stringify(result.rows));
			console.log("jsonData", jsonData);
			const ws = fs.createWriteStream(`./images_uploads/ActiveEvent${Date.now()}.csv`);
			const file = fastcsv
			  .write(jsonData, { headers: true })
			  .on("finish", function() {
				console.log("Export to CSV Successfully!");
			  })
			  .pipe(ws);
			res.json({
				message: "Active Event Exported File",
				status: true,
				total: Data.rows[0].count,
				result: `${file.path}`
			});
		}
	});
}

event.exportEvent_Active = async (req, res) => {
	const Data = await sql.query(`SELECT COUNT(*) AS count FROM "event"`);
	sql.query(`SELECT * FROM "event" WHERE event_status = $1`,["active"], (err, result) => {
		if (err) {
			console.log(err);
			res.json({
				message: "Try Again",
				status: false,
				err
			});
		} else {
			const jsonData = JSON.parse(JSON.stringify(result.rows));
			console.log("jsonData", jsonData);
			const ws = fs.createWriteStream(`./images_uploads/ActiveEvent${Date.now()}.csv`);
			const file = fastcsv
			  .write(jsonData, { headers: true })
			  .on("finish", function() {
				console.log("Export to CSV Successfully!");
			  })
			  .pipe(ws);
			res.json({
				message: "Active Event Exported File",
				status: true,
				total: Data.rows[0].count,
				result: `${file.path}`
			});
		}
	});
}

event.update = async (req, res) => {
	if (req.body.id === '') {
		res.json({
			message: "id is required",
			status: false,
		});
	} else {
		const eventData = await sql.query(`select * from "event" where id = $1`, [req.body.id]);
		const oldName = eventData.rows[0].name;
		const oldlocation = eventData.rows[0].location;
		const olddate = eventData.rows[0].date;
		const oldtime = eventData.rows[0].time;
		const olddeadline = eventData.rows[0].deadline;
		const oldactivity_cost = eventData.rows[0].activity_cost;
		const oldpayment_date = eventData.rows[0].payment_date;
		const oldevent_status = eventData.rows[0].event_status;
		let { id, name, location, date,time, deadline , activity_cost, payment_date,event_status  } = req.body;
		if (name === undefined || name === '') {
			name = oldName;
		}
		if (location === undefined || location === '') {
			location = oldlocation;
		}
		if (date === undefined || date === '') {
			date = olddate;
		}
		if (time === undefined || time === '') {
            time = oldtime;
        }
		if (deadline === undefined || deadline === '') {
			deadline = olddeadline;
		}
		if (activity_cost === undefined || activity_cost === '') {
            activity_cost = oldactivity_cost;
        }
		if (payment_date === undefined || payment_date === '') {
            payment_date = oldpayment_date;
        }
		if (event_status === undefined || payment_date === '') {
            event_status = oldevent_status;
        }

		sql.query(`UPDATE "event" SET name = $1, location = $2, 
		date = $3, time = $4, deadline = $5 , activity_cost = $6,
		payment_date = $7, event_status = $8 WHERE id = $9;`,
			[name, location, date, time, deadline, activity_cost, payment_date, event_status , id], async (err, result) => {
				if (err) {
					console.log(err);
					res.json({
						message: "Try Again",
						status: false,
						err
					});
				} else {
					if (result.rowCount === 1) {		
						const data = await sql.query(`select * from "event" where id = $1`, [req.body.id]);
						res.json({
							message: "Event Updated Successfully!",
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


event.delete = async (req, res) => {
	const data = await sql.query(`select * from "event" where id = $1`, [req.params.id]);
	if (data.rows.length === 1) {
		sql.query(`DELETE FROM "event" WHERE id = $1;`, [req.params.id], (err, result) => {
			if (err) {
				res.json({
					message: "Try Again",
					status: false,
					err
				});
			} else {
				res.json({
					message: "Event Deleted Successfully!",
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
module.exports = event;