// constants
const PORT = 5002
const AMQP_URL = 'amqp://localhost:5672';
const CHANNEL_NAME = 'employee';

const express = require('express');
const amqp = require('amqplib');
const knex = require('./knex/knex.js');
const app = express();

let channel, connection;

const connect = async () => {
  try {
    connection = await amqp.connect(AMQP_URL);
    channel = await connection.createChannel();
    await channel.assertQueue(CHANNEL_NAME);

    await channel.consume(CHANNEL_NAME, async data => {
      // retrieve the data from channel and parse into JSON
      employeeData = JSON.parse(Buffer.from(data.content))

      await knex('employee').insert({
        id: employeeData.id,
        name: employeeData.employee_name,
        email: employeeData.email,
        contact: employeeData.contact,
        company: employeeData.company
      })
      .onConflict("id")
      .ignore();

      // Acknowledge the channel
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

// Stop server gracefully
process.on('SIGTERM', async () => {
  await channel.close();
  await connection.close();
  app.close(() => {
    console.log('Process terminated')
    process.kill(process.pid, 'SIGTERM')
  })
})
