module.exports = app => {

const MembershipLevel = require("../controllers/MembershipLevel");

let router = require("express").Router();

router.post("/add", MembershipLevel.create);
router.post("/view_specific", MembershipLevel.viewSpecific);
router.get("/view_all", MembershipLevel.viewAll);
router.put("/update", MembershipLevel.update);
router.delete("/delete/:id" , MembershipLevel.delete)



app.use("/membership_level", router);
};
