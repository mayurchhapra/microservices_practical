
const { Router } = require('express');
const router = Router();
const apiAdapter = require('./apiAdapter');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:5001/';
const version  = 'v1';
const api = apiAdapter(`${BASE_URL}${version}`);

const UPLOAD_PATH = path.join(__dirname, '..', '/uploads/')

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
      // res.status(200).json({message: 'File uploaded successfully.'});
    });
  } catch (err) {
    return res.status(500).json({ error: err });
  }
  // data.append('fileName', fs.createReadStream(fullPath));

    // console.log();

    // api.post(req.path, data, {
    //   headers: {
    //     ...data.getHeaders(),
    //   }
    // }).then((response) => {
    //   return res.send(response.data);
    // });


  api.post(req.path, req).then((response) => {
    res.send(response.data);
  })
});

module.exports = router;