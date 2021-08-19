const { Router } = require('express');
const apiAdapter = require('./apiAdapter');
const router = Router();

// Call via docker
const BASE_URL = 'http://m2:5003/';
const version  = 'v1';
const api = apiAdapter(`${BASE_URL}${version}`);

router.get('/getEmployee', (req, res) => {
  api.get(req.path).then((response) => {
    res.send(response.data);
  })
});

module.exports = router;