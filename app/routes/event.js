module.exports = app => {

const event = require("../controllers/event");

let router = require("express").Router();

router.post("/add", event.create);
router.post("/view_specific", event.viewSpecific);
router.get("/view_all", event.viewAll);
router.put("/update", event.update);
router.delete("/delete/:id" , event.delete)
router.post("/register_event", event.registration);
router.post("/charge_record", event.ChargeRecord);
router.get("/export_active_event", event.exportEvent);
router.post("/view_all_registration", event.viewAllRegistration);

app.use("/event", router);
};
