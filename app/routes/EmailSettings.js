module.exports = app => {

const EmailSettings = require("../controllers/EmailSettings");

let router = require("express").Router();

router.post("/add", EmailSettings.create);
router.post("/view_specific", EmailSettings.viewSpecific);
router.get("/view_all", EmailSettings.viewAll);
router.put("/update", EmailSettings.update);
router.delete("/delete/:id" , EmailSettings.delete)


app.use("/email_settings", router);
};
