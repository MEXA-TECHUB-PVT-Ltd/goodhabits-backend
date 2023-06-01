module.exports = app => {

const goodsInventory = require("../controllers/goodsInventory");

let router = require("express").Router();

router.post("/add", goodsInventory.create);
router.post("/view_specific", goodsInventory.viewSpecific);
router.get("/view_all", goodsInventory.viewAll);
router.put("/update", goodsInventory.update);
router.delete("/delete/:id" , goodsInventory.delete)
router.get("/export_goods", goodsInventory.exportGoods);






app.use("/goods_inventory", router);
};
