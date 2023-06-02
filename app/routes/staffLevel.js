module.exports = app => {

const staffLevel = require("../controllers/staffLevel");

let router = require("express").Router();

router.post("/add", staffLevel.create);
router.post("/view_specific", staffLevel.viewSpecific);
router.get("/view_all", staffLevel.viewAll);
router.put("/update", staffLevel.update);
router.delete("/delete/:id" , staffLevel.delete)
router.post("/report_customer_communication", staffLevel.Report);






app.use("/staff_level", router);
};
