// constants
const PORT = 5002
const AMQP_URL = 'amqp://localhost:5672';
const CHANNEL_NAME = 'employee';

const express = require('express');
const amqp = require('amqplib');
const app = express();

let channel, connection;

const connect = async () => {
  try {
    connection = await amqp.connect(AMQP_URL);
    channel = await connection.createChannel();
    await channel.assertQueue(CHANNEL_NAME);

    await channel.consume(CHANNEL_NAME, data => {
      console.log(`Received data at ${PORT}: ${Buffer.from(data.content)}`);
      channel.ack(data);
    });

  } catch (e) {
    console.log(e);
  }
};

app.listen(PORT, async () => {
  await connect();
  console.log(`Server is running at ${PORT}`);
});


process.on('exit', async () =>{
  await channel.close();
  await connection.close();
});
