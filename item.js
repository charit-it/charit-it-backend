const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const mysql = require("mysql");

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: "charit_it"
});

app.use(cors());
app.use(bodyParser.json());

app.get("/item", function(req, res) {
  connection.query("SELECT * FROM item", function(err, data) {
    if(err){
      console.log("Error fetching items", err);
      res.status(500).json({
        error: err
      });
    }else{
      res.json({
        item: data
      });
    }
  });
});

app.delete("/item/:itemId", function(req, res) {
  const itemId = req.params.itemId;
  connection.query("DELETE from item WHERE itemId = ?", [itemId], function(err) {
    if(err){
      res.status(500).json({error: err});
    }else{
      res.sendStatus(200);
    }
  });
});

app.post("/item", function(req, res) {
  const itemId = req.body.itemId;
  const userId = req.body.userId;
  const itemUrl = req.body.image_URL;
  const itemType = req.body.itemType;
  const itemName = req.body.item_name;
  const itemDes = req.body.item_description;
  const itemPri = req.body.item_price;

  const q = "INSERT INTO item (itemId, userId, image_URL, itemType, item_name, item_description, item_price) VALUES (?, ?, ?, ?, ?, ?, ?)";
  connection.query(q, [itemId, userId, itemUrl, itemType, itemName, itemDes, itemPri], function(err, results) {
    if(err){
      res.status(500).json({error: err});
    }else{
      res.status(201).json({
        itemId: itemId,
        userId: userId,
        image_URL: itemUrl,
        itemType: itemType,
        item_name: itemName,
        item_description: itemDes,
        item_price: itemPri
      });
    }
  });
});

app.put("/item/:itemId", function(req, res) {
  const itemId = req.params.itemId;
  const itemDes = req.body.item_description;
  const itemPri = req.body.item_price;

  const q = "UPDATE item SET item_description = ?, item_price = ? WHERE itemId = ?";
  connection.query(q, [itemDes, itemPri, itemId], function(err, results) {
    if(err){
      res.status(500).json({error: err});
    }else{
      res.status(200).json({
        itemId: itemId,
        item_description: itemDes,
        item_price: itemPri
      });
    }
  });
});

module.exports.handler = serverless(app);
