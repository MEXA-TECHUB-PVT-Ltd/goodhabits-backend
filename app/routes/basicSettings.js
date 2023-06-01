module.exports = app => {

    const basicSettings = require("../controllers/basicSettings");
    const upload = require("../middlewares/FolderImagesMulter")

    let router = require("express").Router();

    router.post("/add", upload.fields([{
        name: 'logo', maxCount: 1
    }, {
        name: 'icon', maxCount: 1
    }]), basicSettings.create);
    router.post("/view_specific", basicSettings.viewSpecific);
    router.get("/view_all", basicSettings.viewAll);
    router.put("/update", upload.fields([{
        name: 'logo', maxCount: 1
    }, {
        name: 'icon', maxCount: 1
    }]), basicSettings.update);

    router.delete("/delete/:id", basicSettings.delete)






    app.use("/basic_settings", router);
};
