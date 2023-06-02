module.exports = app => {

const staffPermissions = require("../controllers/staffPermissions");

let router = require("express").Router();

router.post("/add", staffPermissions.create);
router.post("/view_specific", staffPermissions.viewSpecific);
router.get("/view_all", staffPermissions.viewAll);
router.put("/update", staffPermissions.update);
router.delete("/delete/:id" , staffPermissions.delete)

app.use("/staff_permissions", router);
};
