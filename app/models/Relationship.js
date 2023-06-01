
const { sql } = require("../config/db.config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Relationship = function (Relationship) {
	this.registration_date = Relationship.registration_date;
	this.relationship_number = Relationship.relationship_number;
	this.participant_number = Relationship.participant_number
	this.participant_relations = Relationship.participant_relations;
	this.relationship_name = Relationship.relationship_name;
	this.telephone_number = Relationship.telephone_number;
};

Relationship.add = async (req, res) => {
	sql.query(`CREATE TABLE IF NOT EXISTS public.relationship (
        id SERIAL NOT NULL,
		registration_date timestamp,
        relationship_number text ,
        participant_number text,
		participant_relations text[],
		relationship_name text ,
        telephone_number text ,
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
			if (!req.body.relationship_number || req.body.relationship_number === '') {
				res.json({
					message: "Please Enter relationship_number",
					status: false,
				});
			} else if (!req.body.registration_date) {
				res.json({
					message: "Please Enter registration_date",
					status: false,
				});
			} else {
				const { registration_date, relationship_number, participant_number, participant_relations, relationship_name,
					telephone_number } = req.body;

				const query = `INSERT INTO "relationship"
				 (id,registration_date, relationship_number,participant_number,participant_relations,relationship_name,telephone_number 
					  ,createdAt ,updatedAt )
                            VALUES (DEFAULT, $1, $2, $3, $4, $5, $6 , 'NOW()','NOW()' ) RETURNING * `;
				const foundResult = await sql.query(query,
					[registration_date, relationship_number, participant_number,
						 participant_relations, relationship_name, telephone_number]);
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
							message: "Relationship Added Successfully!",
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

Relationship.viewSpecific = (req, res) => {
	sql.query(`SELECT * FROM "relationship" WHERE ( id = $1)`, [req.body.id], (err, result) => {
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

// Relationship.viewRelationshipbyparticipant_number = (req, res) => {
// 	sql.query(`SELECT * FROM "relationship" WHERE ( participant_number = $1)`, [req.body.participant_number], (err, result) => {
// 		if (err) {
// 			console.log(err);
// 			res.json({
// 				message: "Try Again",
// 				status: false,
// 				err
// 			});
// 		} else {
// 			res.json({
// 				message: "Subscription Plan Details",
// 				status: true,
// 				result: result.rows
// 			});
// 		}
// 	});
// }

// Relationship.viewRelationshiptelephone = (req, res) => {
// 	sql.query(`SELECT * FROM "relationship" WHERE ( telephone = $1)`, ['yes'], (err, result) => {
// 		if (err) {
// 			console.log(err);
// 			res.json({
// 				message: "Try Again",
// 				status: false,
// 				err
// 			});
// 		} else {
// 			res.json({
// 				message: "Subscription Plan Details",
// 				status: true,
// 				result: result.rows
// 			});
// 		}
// 	});
// }


// Relationship.viewPayments = async function (req, res) {
// 	const { relationship_name, telephone_number, newtelephone_number } = req.body;
// 	// const hashtelephone_number = await bcrypt.hash(newtelephone_number, salt);
// 	// const oldtelephone_number = await bcrypt.hash(telephone_number, salt);
// 	sql.query(`SELECT * FROM "relationship" WHERE relationship_name = $1`, [relationship_name], async (err, results) => {
// 		if (err) {
// 			console.log(err);
// 			res.json({
// 				message: "Try Again",
// 				status: false,
// 				err
// 			});
// 		}
// 		else {
// 			if (results.rows.length == 0) {
// 				res.json({
// 					message: "Relationship Not Found",
// 					status: false,
// 				});
// 			} else {
// 				if (bcrypt.compareSync(req.body.telephone_number, results.rows[0].telephone_number)) {
// 					const salt = await bcrypt.genSalt(10);
// 					const hashtelephone_number = await bcrypt.hash(newtelephone_number, salt);
// 					sql.query(`UPDATE "relationship" SET telephone_number = $1 WHERE id = $2`, [hashtelephone_number, results.rows[0].id], (err, result) => {
// 						if (err) {
// 							console.log(err);
// 							res.json({
// 								message: "Try Again",
// 								status: false,
// 								err
// 							});
// 						}
// 						else {
// 							res.json({
// 								message: "telephone_number Changed Successfully",
// 								status: true,
// 								results: results.rows
// 							});
// 						}
// 					})
// 				}
// 				else {
// 					res.json({
// 						message: "Incorrect telephone_number",
// 						status: false,
// 					});
// 				}

// 			}
// 		}
// 	});

// }


Relationship.viewAll = async (req, res) => {
	const Data = await sql.query(`SELECT COUNT(*) AS count FROM "relationship"`);

	sql.query(`SELECT * FROM "relationship" `, (err, result) => {
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
				message: "Relationship Details",
				status: true,
				result: result.rows
			});
		}
	});
}

// Relationship.ViewAllBlockedRelationships = (req, res) => {
// 	sql.query(`SELECT * FROM "relationship" WHERE profession = $1`, ['block'], (err, result) => {
// 		if (err) {
// 			res.json({
// 				message: "Try Again",
// 				status: false,
// 				err
// 			});
// 		} else {
// 			res.json({
// 				message: "Relationship Details",
// 				status: true,
// 				result: result.rows
// 			});
// 		}
// 	});
// }
// Relationship.ViewAllSubscribedRelationship = (req, res) => {
// 	sql.query(`SELECT * FROM "relationship" WHERE telephone = $1`, ['subscriber'], (err, result) => {
// 		if (err) {
// 			res.json({
// 				message: "Try Again",
// 				status: false,
// 				err
// 			});
// 		} else {
// 			res.json({
// 				message: "Subscribed Relationship Details",
// 				status: true,
// 				result: result.rows
// 			});
// 		}
// 	});
// }

// Relationship.SpecificRelationship = (req, res) => {
// 	sql.query(`SELECT * FROM "relationship" WHERE id = $1`, [req.body.id], (err, result) => {
// 		if (err) {
// 			res.json({
// 				message: "Try Again",
// 				status: false,
// 				err
// 			});
// 		} else {
// 			res.json({
// 				message: "Subscribed Relationship Details",
// 				status: true,
// 				result: result.rows
// 			});
// 		}
// 	});
// }
// Relationship.AllMemberRelationships = (req, res) => {
// 	sql.query(`SELECT * FROM "relationship" WHERE telephone = $1`, ['member'], (err, result) => {
// 		if (err) {
// 			res.json({
// 				message: "Try Again",
// 				status: false,
// 				err
// 			});
// 		} else {
// 			res.json({
// 				message: "Subscribed Relationship Details",
// 				status: true,
// 				result: result.rows
// 			});
// 		}
// 	});
// }
// Relationship.changeprofession = (req, res) => {
// 	if (req.body.profession === '') {
// 		res.json({
// 			message: "Please Enter profession",
// 			status: false,
// 		});
// 	} else {
// 		sql.query(`UPDATE "relationship" SET profession = $1 WHERE id = $2;`, [req.body.profession, req.body.id], async (err, result) => {
// 			if (err) {
// 				res.json({
// 					message: "Try Again",
// 					status: false,
// 					err
// 				});
// 			} else {
// 				if (result.rowCount === 1) {
// 					const data = await sql.query(`select * from "relationship" where id = $1`, [req.body.id]);
// 					res.json({
// 						message: "Relationship Updated Successfully!",
// 						status: true,
// 						result: data.rows,
// 					});
// 				} else if (result.rowCount === 0) {
// 					res.json({
// 						message: "Not Found",
// 						status: false,
// 					});
// 				}
// 			}
// 		});
// 	}
// }

Relationship.update = async (req, res) => {
	if (req.body.id === '') {
		res.json({
			message: "id is required",
			status: false,
		});
	} else {
		const RelationshipData = await sql.query(`select * from "relationship" where id = $1`, [req.body.id]);
		const oldregistration_date = RelationshipData.rows[0].registration_date;
		const oldrelationship_number = RelationshipData.rows[0].relationship_number;
		const oldparticipant_number = RelationshipData.rows[0].participant_number;
		const oldparticipant_relations = RelationshipData.rows[0].participant_relations;
		const oldrelationship_name = RelationshipData.rows[0].relationship_name;
		const oldtelephone_number = RelationshipData.rows[0].telephone_number;
		const oldtelephone = RelationshipData.rows[0].telephone;
		const oldprofession = RelationshipData.rows[0].profession;
		const oldage = RelationshipData.rows[0].age;
		const olddate_of_birth  = RelationshipData.rows[0].date_of_birth;
		const oldmarital_status = RelationshipData.rows[0].marital_status;
		const oldno_of_children = RelationshipData.rows[0].no_of_children;
		const oldchildrens_age = RelationshipData.rows[0].childrens_age;
		const oldliving_area = RelationshipData.rows[0].living_area;
		const oldschedule  = RelationshipData.rows[0].schedule;
		const oldlanguage = RelationshipData.rows[0].language;
		const oldintroducer = RelationshipData.rows[0].introducer;
		const oldbest_contact_time = RelationshipData.rows[0].best_contact_time;
		const oldRelationship_level = RelationshipData.rows[0].Relationship_level;
		const oldparticipant_remarks = RelationshipData.rows[0].participant_remarks;


		let { registration_date, relationship_number, participant_number, participant_relations, relationship_name,
			telephone_number, telephone, profession, age, date_of_birth, marital_status,
			no_of_children, childrens_age, living_area, schedule, language,
			introducer, best_contact_time, Relationship_level, participant_remarks, id} = req.body;

		if (registration_date === undefined || registration_date === '') {
			registration_date = oldregistration_date;
		}
		if (relationship_number === undefined || relationship_number === '') {
			relationship_number = oldrelationship_number;
		}
		if (participant_number === undefined || participant_number === '') {
			participant_number = oldparticipant_number;
		}
		if (participant_relations === undefined || participant_relations === '') {
			participant_relations = oldparticipant_relations;
		}
		if (relationship_name === undefined || relationship_name === '') {
			relationship_name = oldrelationship_name;
		}
		if (telephone_number === undefined || telephone_number === '') {
			telephone_number = oldtelephone_number;
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
		if (Relationship_level === undefined || Relationship_level === '') {
			Relationship_level = oldRelationship_level;
		}
		if (participant_remarks === undefined || participant_remarks === '') {
			participant_remarks = oldparticipant_remarks;
		}





		sql.query(`UPDATE "relationship" SET registration_date =  $1, 
		relationship_number =  $2, 
		participant_number  =  $3 , 
		participant_relations =  $4, 
		relationship_name =  $5, telephone_number =  $6 ,telephone =  $7 , profession =  $8, age =  $9, 
		date_of_birth =  $10,
			marital_status  =  $11,
			no_of_children =  $12,
			childrens_age =  $13,
			living_area =  $14,
			schedule =  $15,
			language =  $16,
			introducer =  $17,
			best_contact_time  =  $18,
			Relationship_level =  $19,
			participant_remarks=  $20  WHERE id = $21;`,
			[registration_date, relationship_number, participant_number, participant_relations, relationship_name,
				telephone_number, telephone, profession, age, date_of_birth, marital_status,
				no_of_children, childrens_age, living_area, schedule, language,
				introducer, best_contact_time, Relationship_level, participant_remarks, id], async (err, result) => {
					if (err) {
						console.log(err);
						res.json({
							message: "Try Again",
							status: false,
							err
						});
					} else {
						if (result.rowCount === 1) {
							const data = await sql.query(`select * from "relationship" where id = $1`, [req.body.id]);
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


Relationship.delete = async (req, res) => {
	const data = await sql.query(`select * from "relationship" where id = $1`, [req.params.id]);
	if (data.rows.length === 1) {
		sql.query(`DELETE FROM "relationship" WHERE id = $1;`, [req.params.id], (err, result) => {
			if (err) {
				res.json({
					message: "Try Again",
					status: false,
					err
				});
			} else {
				res.json({
					message: "Relationship Deleted Successfully!",
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
module.exports = Relationship;