const express = require("express");
const amqp = require("amqplib");
const app = express();

const amqpUrl = "amqp://localhost:5672";

const orderData = {
  customerId: 23,
  orderId: 2323,
  number: "2323 2323 2323",
};

app.get("/", async (req, res) => {
  try {
    const connection = await amqp.connect(amqpUrl);
    const channel = await connection.createChannel();
    await channel.assertQueue("order.shipped");
    channel.sendToQueue(
      "order.shipped",
      Buffer.from(JSON.stringify(orderData))
    );
  } catch (error) {
    console.log(error);
  }

  res.send("ORDERS API!");
});

app.listen(8000, () => {
  console.log("ORDERS API listening on port 8000!");
});
