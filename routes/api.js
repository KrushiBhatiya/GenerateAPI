var express = require('express');
var router = express.Router();


var TC = require('../middleware/tokenCheck')
var AC = require('../controller/apiController')

// var st = "hello"
router.post('/:name' , TC.checkToken , AC.createData)
router.post('/:name/:id' , TC.checkToken , AC.editData)
router.get('/:name' , TC.checkToken , AC.viewData)
router.delete('/:name/:id' , TC.checkToken , AC.deleteData)
router.patch('/:name/:id', TC.checkToken , AC.editData)

module.exports = router;
