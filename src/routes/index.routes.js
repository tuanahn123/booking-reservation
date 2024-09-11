const express = require("express");
const router = express.Router()



router.use("/api/ticket", require('./ticket.routes'))
router.use("/api/booking", require('./booking.routes'))
router.use("/api", require('./access.routes'))


module.exports = router