const { Router } = require('express');
const apiAdapter = require('./apiAdapter');
const router = Router();

const BASE_URL = 'http://localhost:5003/';
const version  = 'v1';
const api = apiAdapter(`${BASE_URL}${version}`);

router.get('/getEmployee', (req, res) => {
  api.get(req.path).then((response) => {
    res.send(response.data);
  })
});

module.exports = router;