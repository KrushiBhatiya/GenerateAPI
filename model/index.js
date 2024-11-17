const mongoose = require('mongoose')
const keySchema = new mongoose.Schema({
    apiKey : String,
    modelName : String,
    modelField : Object
})
module.exports = mongoose.model('modelCreate',keySchema)