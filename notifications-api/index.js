const express = require("express");
const amqp = require("amqplib");
const app = express();

const amqpUrl = "amqp://localhost:5672";

app.get("/", async (req, res) => {
  res.send("NOTIFICATIONS API!");
});

async function connect() {
  try {
    const connection = await amqp.connect(amqpUrl);
    const channel = await connection.createChannel();
    await channel.assertQueue("order.shipped");
    channel.consume("order.shipped", (message) => {
      console.log("RECIEVED MESSAGE!");
      console.log(message.content.toString());
      channel.ack(message);
    });
  } catch (error) {
    console.log(error);
  }
}

connect();

app.listen(8001, () => {
  console.log("NOTIFICATIONS API listening on port 8001!");
});
