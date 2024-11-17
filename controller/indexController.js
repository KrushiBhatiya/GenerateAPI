const MC = require('../model/index')

exports.indexPage = function (req, res, next) {
    res.render('index');
}
exports.modelPage = function (req, res, next) {
    res.render('modelCreate');
}
exports.createModel = async(req, res) => {

    await MC.create(req.body)
    res.json({ status: 'success'});
    
}

