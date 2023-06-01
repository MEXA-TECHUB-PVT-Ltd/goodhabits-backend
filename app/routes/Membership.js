module.exports = app => {

const Membership = require("../controllers/Membership");

let router = require("express").Router();

router.post("/add", Membership.create);
router.post("/add_relationship", Membership.add);
router.post("/view_specific", Membership.viewSpecific);
router.get("/view_all", Membership.viewAll);
router.put("/update", Membership.update);
router.delete("/delete/:id" , Membership.delete)
router.post("/view_member_activity_record", Membership.ActivityRecord);






app.use("/membership", router);
};
