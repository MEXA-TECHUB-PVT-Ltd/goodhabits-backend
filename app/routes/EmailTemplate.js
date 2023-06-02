module.exports = app => {

const EmailTemplate = require("../controllers/EmailTemplate");

let router = require("express").Router();

router.post("/add", EmailTemplate.create);
router.post("/view_specific", EmailTemplate.viewSpecific);
router.get("/view_all", EmailTemplate.viewAll);
router.put("/update", EmailTemplate.update);
router.delete("/delete/:id" , EmailTemplate.delete)


app.use("/email_template", router);
};
