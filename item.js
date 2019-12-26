const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get("/item", function(req, res) {
  const item = req.body;
  res.sendStatus(200).json(item);
});

app.post("/item", function(req, res) {
  const itemName = req.body.itemName;
  const itemDesc = req.body.itemDesc;
  const itemPrice = req.body.itemPrice;

  res.json({
    message: `Received a request to add a new item: ${itemName}, description: ${itemDesc} and price: ${itemPrice}`
  })
});

app.delete("/item/:itemId", function(req, res) {
  const itemId = req.param.itemId;
  res.sendStatus(200);
});

module.exports.handler = serverless(app);
