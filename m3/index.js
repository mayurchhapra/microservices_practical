// constants
const PORT = 5003

const express = require('express');
const { getEmployeeList } = require('./controller');

const app = express();

app.get('/v1/getEmployee', getEmployeeList);

app.listen(PORT, async () => {
  console.log(`Server is running at ${PORT}`);
});

// Stop server gracefully
process.on('SIGTERM', async () => {
  app.close(() => {
    console.log('Process terminated')
    process.kill(process.pid, 'SIGTERM')
  })
})
