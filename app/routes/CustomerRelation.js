module.exports = app => {

const CustomerRelation = require("../controllers/CustomerRelation");

let router = require("express").Router();

router.post("/add", CustomerRelation.create);
router.post("/view_specific", CustomerRelation.viewSpecific);
router.get("/view_all", CustomerRelation.viewAll);
router.put("/update", CustomerRelation.update);
router.delete("/delete/:id" , CustomerRelation.delete)
router.post("/report_customer_communication", CustomerRelation.Report);






app.use("/customer_relation", router);
};
