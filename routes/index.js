var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');

var IC = require('../controller/indexController')

router.get('/', IC.indexPage);
router.get('/modelPage', IC.modelPage);
router.post('/submit', IC.createModel);
module.exports = router;
