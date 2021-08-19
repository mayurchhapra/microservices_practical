
const { Router } = require('express');
const router = Router();
const apiAdapter = require('./apiAdapter');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

// Call via Docker
const BASE_URL = 'http://m1:5001/';
const version  = 'v1';
const api = apiAdapter(`${BASE_URL}${version}`);

const UPLOAD_PATH = path.join(__dirname, '..', '/uploads/')


// Not a good way to do this, But as per the time constraints this will do the job.
const passFileToAPI = (req, res, fullPath) => {
  return new Promise((resolve, reject) => {
    try {
    const data = new FormData();
    data.append('fileName', fs.createReadStream(fullPath));

    api.post(req.path, data, {
      headers: {
        ...data.getHeaders(),
      }
    }).then((response) => {
      return resolve(res.json(response.data));
    });
    } catch (err) {
      return reject(err);
    }
  });
};

router.post('/upload', (req, res) => {
  try {
    const file = req.files.fileName;
    const fullPath = `${UPLOAD_PATH}${file.name}`

    file.mv(fullPath, async (err) => {
      if (err){
        res.status(500).json({err});
      }
      passFileToAPI(req, res, fullPath);
    });
  } catch (err) {
    return res.status(500).json({ error: err });
  }

  api.post(req.path, req).then((response) => {
    res.send(response.data);
  })
});

module.exports = router;