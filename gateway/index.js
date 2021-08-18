// Constants
const PORT = 3000

const express = require('express');
const app = express();
const router = require('./routes');
const upload = require("express-fileupload")

app.use(upload());
app.use(express.json());
app.use(router);

app.get('/', (req, res) => {
  res.send("Simple API Gateway")
})

app.listen(PORT, () => {
  console.log(`Gateway has been started on port ${PORT}`);
})

// Stop server gracefully
process.on('SIGTERM', async () => {
  app.close(() => {
    console.log('Process terminated')
    process.kill(process.pid, 'SIGTERM')
  })
})