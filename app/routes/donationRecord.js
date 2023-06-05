module.exports = app => {

const donationRecord = require("../controllers/donationRecord");

let router = require("express").Router();

router.post("/add", donationRecord.create);
router.post("/view_specific", donationRecord.viewSpecific);
router.get("/export_record", donationRecord.exportRecord);
router.get("/view_all", donationRecord.viewAll);
router.put("/update", donationRecord.update);
router.delete("/delete/:id" , donationRecord.delete)

app.use("/donation_record", router);
};
