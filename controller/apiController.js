const MC = require('../model/index')
const MD = require('../model/modelData')
const { parse, isValid: isValidDate } = require('date-fns');
exports.createData = async (req, res) => {

    var token = req.headers.authorization
    var collectionName = req.params.name
    var validCollection = await MC.findOne({ apiKey: token, modelName: collectionName })

    var tokenData = await MC.findOne({ apiKey: token })

    var preKey = Object.keys(tokenData.modelField)
    var postKey = Object.keys(req.body)

    try {


        if (!validCollection) throw new Error("Invalid CollectionName")

        if (Object.keys(req.body).length === 0) {
            throw new Error("Please Enter Data")
        }
        if (JSON.stringify(preKey) !== JSON.stringify(postKey)) {
            throw new Error("Key doesn't Match")
        }
        const allData = await MD.find({ apiKey: token })
        const duplicateData = await allData.some((item) => {

            const { apiKey, ...filterData } = item.toObject(); // Exclude metadata fields
            return JSON.stringify(filterData.modelFieldData) === JSON.stringify(req.body);
        })
        if (duplicateData) {
            throw new Error("Duplicate Key")
        }

        const isValid = preKey.every((key) => {
            const getType = tokenData.modelField[key]
            const dataValue = req.body[key]
            if (getType === "String") {
                return typeof dataValue === "string"
            }
            if (getType === "Number") {
                return typeof dataValue === "number"
            }
            if (getType === "Boolean") {
                return typeof dataValue === "boolean"
            }
            if (getType === "Date") {
                const date1 = parse(dataValue, 'yyyy-MM-dd', new Date());
                const date2 = parse(dataValue, 'dd-MM-yyyy', new Date());

                return isValidDate(date1) || isValidDate(date2);
            }
            return false
        })

        if (!isValid) {
            throw new Error("Validation Error")
        }

        await MD.create({ apiKey: token, modelFieldData: req.body })

        res.status(200).json({
            Status: "Success",
            Message: "Data Enter Success",
            Data: req.body
        })
    } catch (error) {
        res.status(404).json({
            Status: "Fail",
            Message: error.message,
        })
    }
}

exports.viewData = async (req, res) => {
    var token = req.headers.authorization
    var collectionName = req.params.name
    var validCollection = await MC.findOne({ apiKey: token, modelName: collectionName })
    try {
        if (!validCollection) throw new Error("Invalid CollectionName")
        const data = await MD.find({ apiKey: token })
        if (data.length === 0) throw new Error("Data not found")

        const withoutApiKeyData = data.map((item) => {
            const { apiKey, ...rest } = item.toObject();
            return rest;
        });

        res.status(200).json({
            Status: "Success",
            Message: "Record Get SuccessFully",
            Data: withoutApiKeyData
        })
    } catch (error) {
        res.status(404).json({
            Status: "Fail",
            Message: error.message,
        })
    }
}

exports.deleteData = async (req, res) => {
    const deleteId = req.params.id
    var token = req.headers.authorization
    var collectionName = req.params.name
    var validCollection = await MC.findOne({ apiKey: token, modelName: collectionName })
    try {
        if (!validCollection) throw new Error("Invalid CollectionName")
        const deleteData = await MD.findByIdAndDelete(deleteId)
        if (!deleteData) throw new Error("Record Not Found")
        res.status(200).json({
            Status: "Success",
            Messgae: "Record Delete SuccessFully",
        })
    } catch (error) {
        res.status(404).json({
            Status: "Fail",
            Messgae: error.message
        })
    }
}

exports.editData = async (req, res) => {
    const editId = req.params.id
    var token = req.headers.authorization
    var collectionName = req.params.name
    var validCollection = await MC.findOne({ apiKey: token, modelName: collectionName })
    var tokenData = await MC.findOne({ apiKey: token })

    var preKey = Object.keys(tokenData.modelField)
    var postKey = Object.keys(req.body)

    try {
        if (!validCollection) throw new Error("Invalid CollectionName")
        if (Object.keys(req.body).length === 0) {
            throw new Error("Please Enter Data")
        }
        if (JSON.stringify(preKey) !== JSON.stringify(postKey)) {
            throw new Error("Key doesn't Match")
        }
        // const allData = await MD.find()
        // const duplicateData = await allData.some((item) => {

        //     const { apiKey, ...filterData } = item.toObject();
        //     return JSON.stringify(filterData.modelFieldData) === JSON.stringify(req.body);
        // })
        // if (duplicateData) {
        //     throw new Error("Duplicate Key")
        // }

        const isValid = preKey.every((key) => {
            const getType = tokenData.modelField[key]
            const dataValue = req.body[key]
            if (getType === "String") {
                return typeof dataValue === "string"
            }
            if (getType === "Number") {
                return typeof dataValue === "number"
            }
            if (getType === "Boolean") {
                return typeof dataValue === "boolean"
            }
            if (getType === "Date") {
                const date1 = parse(dataValue, 'yyyy-MM-dd', new Date());
                const date2 = parse(dataValue, 'dd-MM-yyyy', new Date());

                return isValidDate(date1) || isValidDate(date2);
            }
            return false
        })

        if (!isValid) {
            throw new Error("Validation Error")
        }

        const editData = await MD.findByIdAndUpdate(editId, { modelFieldData: req.body })
        if (!editData) throw new Error("Record Not Found")

        res.status(200).json({
            Status: "Success",
            Message: "Data Update SuccessFully",
            Data: req.body
        })
    } catch (error) {
        res.status(404).json({
            Status: "Fail",
            Message: error.message,
        })
    }
}

