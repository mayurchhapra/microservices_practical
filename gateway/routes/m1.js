const { Router } = require('express');
const router = Router();
const apiAdapter = require('./apiAdapter');

const BASE_URL = 'http://localhost:5001/';
const version  = 'v1';
const api = apiAdapter(`${BASE_URL}${version}`);

router.post('/upload', (req, res) => {
  api.post(req.path, req).then((response) => {
    res.send(response.data);
  })
});

module.exports = router;