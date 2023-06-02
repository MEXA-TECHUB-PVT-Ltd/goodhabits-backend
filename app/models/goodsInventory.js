
const { sql } = require("../config/db.config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fastcsv = require("fast-csv");
const fs = require("fs");

const goodsInventory = function (goodsInventory) {
	this.goods = goodsInventory.goods;
	this.quantity = goodsInventory.quantity;
	this.storage_place = goodsInventory.storage_place
};

goodsInventory.create = async (req, res) => {
	sql.query(`CREATE TABLE IF NOT EXISTS public.goods_inventory (
        id SERIAL NOT NULL,
		goods text,
        quantity text ,
        storage_place text,
        createdAt timestamp,
        updatedAt timestamp ,
        PRIMARY KEY (id))  ` , async (err, result) => {
		if (err) {
			res.json({
				message: "Try Again",
				status: false,
				err
			});
		} else {
			const { goods, quantity, storage_place } = req.body;

			const query = `INSERT INTO "goods_inventory"
				 (id,goods, quantity,storage_place,createdAt ,updatedAt )
                            VALUES (DEFAULT, $1, $2, $3, 'NOW()','NOW()' ) RETURNING * `;
			const foundResult = await sql.query(query,
				[goods, quantity, storage_place]);
			if (foundResult.rows.length > 0) {
				if (err) {
					res.json({
						message: "Try Again",
						status: false,
						err
					});
				}
				else {
					res.json({
						message: "Goods Inventory Added Successfully!",
						status: true,
						result: foundResult.rows,
					});
				}
			} else {
				res.json({
					message: "Try Again",
					status: false,
					err
				});
			}

		};
	});
}

goodsInventory.viewSpecific = (req, res) => {
	sql.query(`SELECT * FROM "goods_inventory" WHERE ( id = $1)`, [req.body.id], (err, result) => {
		if (err) {
			console.log(err);
			res.json({
				message: "Try Again",
				status: false,
				err
			});
		} else {
			res.json({
				message: "Goods Inventory Details",
				status: true,
				result: result.rows
			});
		}
	});
}


goodsInventory.viewAll = async (req, res) => {
	const Data = await sql.query(`SELECT COUNT(*) AS count FROM "goods_inventory"`);

	sql.query(`SELECT * FROM "goods_inventory" `, (err, result) => {
		if (err) {
			console.log(err);
			res.json({
				message: "Try Again",
				status: false,
				err
			});
		} else {
			res.json({
				message: "goods Inventory Details",
				status: true,
				total: Data.rows[0].count,
				result: result.rows
			});
		}
	});
}


goodsInventory.exportGoods = async (req, res) => {
	const Data = await sql.query(`SELECT COUNT(*) AS count FROM "goods_inventory"`);
	sql.query(`SELECT * FROM "goods_inventory" `, (err, result) => {
		if (err) {
			console.log(err);
			res.json({
				message: "Try Again",
				status: false,
				err
			});
		} else {
			const jsonData = JSON.parse(JSON.stringify(result.rows));
			console.log("jsonData", jsonData);
			const ws = fs.createWriteStream(`./images_uploads/goods${Date.now()}.csv`);
			const file = fastcsv
			  .write(jsonData, { headers: true })
			  .on("finish", function() {
				console.log("Export to CSV Successfully!");
			  })
			  .pipe(ws);
			res.json({
				message: "goods Inventory Exported File",
				status: true,
				total: Data.rows[0].count,
				result: `localhost:3008/${file.path}`
			});
		}
	});
}


goodsInventory.update = async (req, res) => {
	if (req.body.id === '') {
		res.json({
			message: "id is required",
			status: false,
		});
	} else {
		const goodsInventoryData = await sql.query(`select * from "goods_inventory" where id = $1`, [req.body.id]);
		const oldgoods = goodsInventoryData.rows[0].goods;
		const oldquantity = goodsInventoryData.rows[0].quantity;
		const oldstorage_place = goodsInventoryData.rows[0].storage_place;
		let { goods, quantity, storage_place, id } = req.body;

		if (goods === undefined || goods === '') {
			goods = oldgoods;
		}
		if (storage_place === undefined || storage_place === '') {
			storage_place = oldstorage_place;
		}

		if (quantity === undefined || quantity === '') {
			quantity = oldquantity;
		}
		sql.query(`UPDATE "goods_inventory" SET goods =  $1, 
		quantity =  $2, 
		storage_place  =  $3  WHERE id = $4;`,
			[goods, quantity, storage_place, id], async (err, result) => {
				if (err) {
					console.log(err);
					res.json({
						message: "Try Again",
						status: false,
						err
					});
				} else {
					if (result.rowCount === 1) {
						const data = await sql.query(`select * from "goods_inventory" where id = $1`, [req.body.id]);
						res.json({
							message: "Goods Inventory Updated Successfully!",
							status: true,
							result: data.rows,
						});
					} else if (result.rowCount === 0) {
						res.json({
							message: "Not Found",
							status: false,
						});
					}
				}
			});
	}
}


goodsInventory.delete = async (req, res) => {
	const data = await sql.query(`select * from "goods_inventory" where id = $1`, [req.params.id]);
	if (data.rows.length === 1) {
		sql.query(`DELETE FROM "goods_inventory" WHERE id = $1;`, [req.params.id], (err, result) => {
			if (err) {
				res.json({
					message: "Try Again",
					status: false,
					err
				});
			} else {
				res.json({
					message: "Goods from Invertory Deleted Successfully!",
					status: true,
					result: data.rows,

				});
			}
		});
	} else {
		res.json({
			message: "Not Found",
			status: false,
		});
	}
}
module.exports = goodsInventory;