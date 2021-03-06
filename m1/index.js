// constants
const PORT = 5001
const AMQP_URL = 'amqp://rabbitmq:5672';
const CHANNEL_NAME = 'employee';
const UPLOAD_PATH = `${__dirname}/uploads/`;

const express = require('express');
const amqp = require('amqplib');
const app = express();
const upload = require("express-fileupload")
const csv = require('csvtojson')
let connection, channel;

app.use(express.json());
app.use(upload());

const connect = async () => {
  try {
    connection = await amqp.connect(AMQP_URL);
    channel = await connection.createChannel();
    await channel.assertQueue(CHANNEL_NAME);
  } catch (err) {
    console.log(err);
  }
};

const parseCSV = async (fullPath) => {
  const employeeData = await csv().fromFile(fullPath);
  employeeData.forEach(async emp => {
    await channel.sendToQueue(CHANNEL_NAME, Buffer.from(JSON.stringify(emp)));
  })
};

app.post('/v1/upload', async (req, res) => {
  try {
    const file = req.files.fileName;
    const fullPath = `${UPLOAD_PATH}${file.name}`;
    file.mv(fullPath, async (err) => {
      if (err){
        res.status(500).send(err)
      }
      await parseCSV(fullPath);
      res.status(200).json({
        message: 'File uploaded successfully.'
      });
    })
  } catch (err) {}
});

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