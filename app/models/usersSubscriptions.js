const { sql } = require("../config/db.config");
const UsersSubscriptions = function (UsersSubscriptions) {
    this.userID = UsersSubscriptions.userID;
    this.name = UsersSubscriptions.name;
    this.email = UsersSubscriptions.email
    this.subscriptionID = UsersSubscriptions.subscriptionID;
};
// CONSTRAINT userID FOREIGN KEY (userID)
//         REFERENCES public."StyleTags" (id) MATCH SIMPLE
//         ON UPDATE NO ACTION
//         ON DELETE CASCADE
//         NOT VALID
UsersSubscriptions.AvailSubscription = async (req, res) => {
    sql.query(`CREATE TABLE IF NOT EXISTS public.UsersSubscriptions (
        id SERIAL NOT NULL,
		userID Inte NOT NULL,
        name text ,
        email text,
		subscriptionID SERIAL NOT NULL ,
        createdAt timestamp,
        updatedAt timestamp ,
        PRIMARY KEY (id));  `
        , async (err, result) => {
            if (err) {
                res.json({
                    message: "Try Again",
                    status: false,
                    err
                });
            } else {
                if (!req.body.email) {
                    res.json({
                        message: "Please Enter email",
                        status: false,
                    });
                } else {
                    const { userID, name, email, subscriptionID } = req.body;
                    const query = `INSERT INTO "userssubscriptions" (id,userID, name,email,subscriptionID, createdAt ,updatedAt )
                            VALUES (DEFAULT, $1, $2, $3, $4, 'NOW()','NOW()' ) RETURNING * `;
                    const foundResult = await sql.query(query,
                        [userID, name, email, subscriptionID]);
                    if (foundResult.rows.length > 0) {
                        if (err) {
                            res.json({
                                message: "Try Again",
                                status: false,
                                err
                            });
                        }
                        else {
                            const query = `UPDATE "user" SET type = $1 WHERE id = $2;`;
                            const result = await sql.query(query, ['subscribed', userID]);
                            res.json({
                                message: "Subscription Plan availed Successfully!",
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


//single subscription
UsersSubscriptions.ViewSubscriptionPlanSpecificUser = (req, res) => {
    sql.query(`SELECT "userssubscriptions".id, "userssubscriptions".name AS "Uname"
    ,"userssubscriptions".email, "userssubscriptions"."createdat" as "AvailDate", "subscriptionplan".name,
      "subscriptionplan".price, "subscriptionplan".no_Img_to_pdf_conversion,"subscriptionplan".no_pdf_to_word_conversion,
       "subscriptionplan".no_word_to_pdf_conversion ,"subscriptionplan".freeTrail, 
       "subscriptionplan".freeTrailDays, "subscriptionplan".duratin_days 
      FROM "userssubscriptions" 
      JOIN "subscriptionplan" ON "userssubscriptions"."subscriptionid" = "subscriptionplan"."id" AND "userssubscriptions"."userid" = $1`
        // sql.query(`SELECT * FROM "userssubscriptions" WHERE ( id = $1)`
        , [req.body.id],
        (err, result) => {
            if (err) {
                console.log(err);
                res.json({
                    message: "Try Again",
                    status: false,
                    err
                });
            } else {
                res.json({
                    message: "UsersSubscriptions Details",
                    status: true,
                    result: result.rows
                });
            }
        });
}

UsersSubscriptions.ViewSubscriptionPlanUser = async (req, res) => {

    const data = await sql.query(`SELECT COUNT(*) AS count FROM "userssubscriptions"`);
    let limit = '10';
    let page = req.body.page;
    let result;
    if (!page || !limit) {
        result = await sql.query(`SELECT "userssubscriptions".id, "userssubscriptions".name AS "Uname"
        ,"userssubscriptions".email, "userssubscriptions"."createdat" as "AvailDate", "subscriptionplan".name,
          "subscriptionplan".price, "subscriptionplan".no_Img_to_pdf_conversion,"subscriptionplan".no_pdf_to_word_conversion,
           "subscriptionplan".no_word_to_pdf_conversion ,"subscriptionplan".freeTrail, 
           "subscriptionplan".freeTrailDays, "subscriptionplan".duratin_days
            FROM "userssubscriptions" 
          JOIN "subscriptionplan" ON "userssubscriptions"."subscriptionid" = "subscriptionplan"."id" ORDER BY "createdat" DESC`);
    }
    if (page && limit) {
        limit = parseInt(limit);
        let offset = (parseInt(page) - 1) * limit
        result = await sql.query(`SELECT "userssubscriptions".id, "userssubscriptions".name AS "Uname"
        ,"userssubscriptions".email, "userssubscriptions"."createdat" as "AvailDate", "subscriptionplan".name,
          "subscriptionplan".price, "subscriptionplan".no_Img_to_pdf_conversion,"subscriptionplan".no_pdf_to_word_conversion,
           "subscriptionplan".no_word_to_pdf_conversion ,"subscriptionplan".freeTrail, 
           "subscriptionplan".freeTrailDays, "subscriptionplan".duratin_days
            FROM "userssubscriptions" 
          JOIN "subscriptionplan" ON "userssubscriptions"."subscriptionid" = "subscriptionplan"."id" ORDER BY "createdat" DESC
		LIMIT $1 OFFSET $2 ` , [limit, offset]);
    }
    if (result.rows) {
        res.json({
            message: "UsersSubscriptions Details",
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
module.exports = UsersSubscriptions;