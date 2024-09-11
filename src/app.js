const express = require('express');
const app = express();
require("dotenv").config()
const helmet = require('helmet');
const compression = require('compression');

app.use(helmet())
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))


// TODO init db
require("../src/dbs/init.mongodb")
require("../src/dbs/importDb")

// TODO init router
app.use('/', require("./routes/index.routes"))

// TODO handing error
app.use((req, res, next) => {
    const error = new Error('Not Found')
    error.status = 404
    next(error)
})

app.use((error, req, res, next) => {
    const statusCode = error.status || 500
    return res.status(statusCode).json({
        status: 'error',
        code: statusCode,
        message: error.message || 'Internal Sever Error'
    })
})

module.exports = app