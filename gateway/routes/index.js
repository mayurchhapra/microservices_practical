const { Router } = require('express');
const router = Router();

const m2 = require('./m2');

router.use((req, res, next) => {
  console.log("Called: ", req.path)
  next()
})

router.use(m2);

module.exports = router;