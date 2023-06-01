module.exports = app => {

const Permissions = require("../controllers/Permissions");

let router = require("express").Router();

router.post("/add", Permissions.create);
router.post("/view_specific", Permissions.viewSpecific);
router.get("/view_all", Permissions.viewAll);
router.put("/update", Permissions.update);
router.delete("/delete/:id" , Permissions.delete)

app.use("/permissions", router);
};
