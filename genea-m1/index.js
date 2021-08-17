// constants
const PORT = 5001
const AMQP_URL = 'amqp://localhost:5672';
const CHANNEL_NAME = 'employee';

const express = require('express');
const amqp = require('amqplib');
const app = express();
let connection, channel;

const connect = async () => {
  try {
    connection = await amqp.connect(AMQP_URL);
    channel = await connection.createChannel();
    await channel.assertQueue(CHANNEL_NAME);
  } catch (err) {
    console.log(err);
  }
};



const parseCSV = async (data) => {
  await channel.sendToQueue(CHANNEL_NAME, Buffer.from(JSON.stringify(data)));
  await channel.close();
  await connection.close()
};

app.post('/upload', (req, res) => {
  const { user } = req.body;
  parseCSV(user)
  res.send(user);
});

app.listen(PORT, async () => {
  await connect();
  console.log(`Server is runnnig at ${PORT}`);
});