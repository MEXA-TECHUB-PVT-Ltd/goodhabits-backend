
const { sql } = require("../config/db.config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const membership = function (membership) {
	this.registration_date = membership.registration_date;
	this.parent_id = membership.parent_id;
	this.email = membership.email
	this.full_name = membership.full_name;
	this.call = membership.call;
	this.gender = membership.gender;
	this.telephone = membership.telephone;
	this.profession = membership.profession;
	this.age = membership.age;

	this.date_of_birth = membership.date_of_birth;
	this.marital_status = membership.marital_status;
	this.no_of_children = membership.no_of_children;
	this.childrens_age = membership.childrens_age;
	this.living_area = membership.living_area;
	this.schedule = membership.schedule;
	this.language = membership.language;
	this.introducer = membership.introducer;
	this.best_contact_time = membership.best_contact_time;
	this.membership_level = membership.membership_level;
	this.participant_remarks = membership.participant_remarks;
};

membership.create = async (req, res) => {
	sql.query(`CREATE TABLE IF NOT EXISTS public.membership (
        id SERIAL NOT NULL,
		registration_date timestamp,
        parent_id text ,
        email text,
		full_name text,
		call text ,
        gender text ,
        telephone text,
		profession text,
		age text,
		date_of_birth text,
		marital_status  text,
		no_of_children text,
		childrens_age text,
		living_area text,
		schedule text,
		language text,
		introducer text,
		best_contact_time  text,
		membership_level text,
		participant_remarks text, 
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
			} else if (!req.body.registration_date) {
				res.json({
					message: "Please Enter registration_date",
					status: false,
				});
			} else {
				const { registration_date, parent_id, email, full_name, call,
					gender, telephone, profession, age, date_of_birth, marital_status,
					no_of_children, childrens_age, living_area, schedule, language,
					introducer, best_contact_time, membership_level, participant_remarks } = req.body;

				const query = `INSERT INTO "membership"
				 (id,registration_date, parent_id,email,full_name,call,gender ,telephone , profession,age , date_of_birth ,
					marital_status  ,
					no_of_children ,
					childrens_age ,
					living_area ,
					schedule ,
					language ,
					introducer ,
					best_contact_time  ,
					membership_level ,
					participant_remarks  ,createdAt ,updatedAt )
                            VALUES (DEFAULT, $1, $2, $3, $4, $5, $6, $7, $8, $9 ,$10 ,$11 ,$12 ,$13 ,$14,
								$15 ,$16 ,$17,$18,$19 ,$20 , 'NOW()','NOW()' ) RETURNING * `;
				const foundResult = await sql.query(query,
					[registration_date, parent_id, email, full_name, call, gender, telephone, profession, age, date_of_birth,
						marital_status,
						no_of_children,
						childrens_age,
						living_area,
						schedule,
						language,
						introducer,
						best_contact_time,
						membership_level,
						participant_remarks]);
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
							message: "Membership Added Successfully!",
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

membership.viewSpecific = (req, res) => {
	sql.query(`SELECT * FROM "membership" WHERE ( id = $1)`, [req.body.id], (err, result) => {
		if (err) {
			console.log(err);
			res.json({
				message: "Try Again",
				status: false,
				err
			});
		} else {
			res.json({
				message: "Subscription Plan Details",
				status: true,
				result: result.rows
			});
		}
	});
}


membership.ActivityRecord = (req, res) => {
	sql.query(`SELECT "eventregistration".full_name, "eventregistration".call, "eventregistration".telephone
	, "event".date, "event".name FROM "eventregistration" JOIN "event" ON 
	"eventregistration".event_id  = "event".id `, (err, result) => {
		if (err) {
			console.log(err);
			res.json({
				message: "Try Again",
				status: false,
				err
			});
		} else {
			res.json({
				message: "Activity Record of Membership",
				status: true,
				result: result.rows
			});
		}
	});
}



membership.viewAll = async (req, res) => {
	const Data = await sql.query(`SELECT COUNT(*) AS count FROM "membership"`);

	sql.query(`SELECT * FROM "membership" `, (err, result) => {
		if (err) {
			console.log(err);
			res.json({
				message: "Try Again",
				status: false,
				err
			});
		} else {
			for (let i = 0; i < result.rowCount; i++) {
				result.rows[i] = {
					...result.rows[i],
					count: Data.rows[0].count
				}
			}
			res.json({
				message: "membership Details",
				status: true,
				result: result.rows
			});
		}
	});
}


membership.update = async (req, res) => {
	if (req.body.id === '') {
		res.json({
			message: "id is required",
			status: false,
		});
	} else {
		const membershipData = await sql.query(`select * from "membership" where id = $1`, [req.body.id]);
		const oldregistration_date = membershipData.rows[0].registration_date;
		const oldparent_id = membershipData.rows[0].parent_id;
		const oldemail = membershipData.rows[0].email;
		const oldfull_name = membershipData.rows[0].full_name;
		const oldcall = membershipData.rows[0].call;
		const oldgender = membershipData.rows[0].gender;
		const oldtelephone = membershipData.rows[0].telephone;
		const oldprofession = membershipData.rows[0].profession;
		const oldage = membershipData.rows[0].age;
		const olddate_of_birth  = membershipData.rows[0].date_of_birth;
		const oldmarital_status = membershipData.rows[0].marital_status;
		const oldno_of_children = membershipData.rows[0].no_of_children;
		const oldchildrens_age = membershipData.rows[0].childrens_age;
		const oldliving_area = membershipData.rows[0].living_area;
		const oldschedule  = membershipData.rows[0].schedule;
		const oldlanguage = membershipData.rows[0].language;
		const oldintroducer = membershipData.rows[0].introducer;
		const oldbest_contact_time = membershipData.rows[0].best_contact_time;
		const oldmembership_level = membershipData.rows[0].membership_level;
		const oldparticipant_remarks = membershipData.rows[0].participant_remarks;


		let { registration_date, parent_id, email, full_name, call,
			gender, telephone, profession, age, date_of_birth, marital_status,
			no_of_children, childrens_age, living_area, schedule, language,
			introducer, best_contact_time, membership_level, participant_remarks, id} = req.body;

		if (registration_date === undefined || registration_date === '') {
			registration_date = oldregistration_date;
		}
		if (parent_id === undefined || parent_id === '') {
			parent_id = oldparent_id;
		}
		if (email === undefined || email === '') {
			email = oldemail;
		}
		if (full_name === undefined || full_name === '') {
			full_name = oldfull_name;
		}
		if (call === undefined || call === '') {
			call = oldcall;
		}
		if (gender === undefined || gender === '') {
			gender = oldgender;
		}
		if (telephone === undefined || telephone === '') {
			telephone = oldtelephone;
		}
		if (profession === undefined || profession === '') {
			profession = oldprofession;
		}
		if (date_of_birth === undefined || date_of_birth === '') {
			date_of_birth = olddate_of_birth;
		}
		if (marital_status === undefined || marital_status === '') {
			marital_status = oldmarital_status;
		}
		if (no_of_children === undefined || no_of_children === '') {
			no_of_children = oldno_of_children;
		}
		if (childrens_age === undefined || childrens_age === '') {
			childrens_age = oldchildrens_age;
		}
		if (living_area === undefined || living_area === '') {
			living_area = oldliving_area;
		}
		if (schedule === undefined || schedule === '') {
			schedule = oldschedule;
		}
		if (introducer === undefined || introducer === '') {
			introducer = oldintroducer;
		}
		if (language === undefined || language === '') {
			language = oldlanguage;
		}
		if (age === undefined || age === '') {
			age = oldage;
		}
		if (best_contact_time === undefined || best_contact_time === '') {
			best_contact_time = oldbest_contact_time;
		}
		if (membership_level === undefined || membership_level === '') {
			membership_level = oldmembership_level;
		}
		if (participant_remarks === undefined || participant_remarks === '') {
			participant_remarks = oldparticipant_remarks;
		}
		sql.query(`UPDATE "membership" SET registration_date =  $1, 
		parent_id =  $2, 
		email  =  $3 , 
		full_name =  $4, 
		call =  $5, gender =  $6 ,telephone =  $7 , profession =  $8, age =  $9, 
		date_of_birth =  $10,
			marital_status  =  $11,
			no_of_children =  $12,
			childrens_age =  $13,
			living_area =  $14,
			schedule =  $15,
			language =  $16,
			introducer =  $17,
			best_contact_time  =  $18,
			membership_level =  $19,
			participant_remarks=  $20  WHERE id = $21;`,
			[registration_date, parent_id, email, full_name, call,
				gender, telephone, profession, age, date_of_birth, marital_status,
				no_of_children, childrens_age, living_area, schedule, language,
				introducer, best_contact_time, membership_level, participant_remarks, id], async (err, result) => {
					if (err) {
						console.log(err);
						res.json({
							message: "Try Again",
							status: false,
							err
						});
					} else {
						if (result.rowCount === 1) {
							const data = await sql.query(`select * from "membership" where id = $1`, [req.body.id]);
							res.json({
								message: "Subscription Plan Updated Successfully!",
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


membership.delete = async (req, res) => {
	const data = await sql.query(`select * from "membership" where id = $1`, [req.params.id]);
	if (data.rows.length === 1) {
		sql.query(`DELETE FROM "membership" WHERE id = $1;`, [req.params.id], (err, result) => {
			if (err) {
				res.json({
					message: "Try Again",
					status: false,
					err
				});
			} else {
				res.json({
					message: "Membership Deleted Successfully!",
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
module.exports = membership;