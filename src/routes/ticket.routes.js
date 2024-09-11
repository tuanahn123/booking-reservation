const express = require("express");
const ticketController = require("../controllers/ticket.controller");
const asyncHandler = require("../../src/helpers/asyncHandler");
const { authentication } = require("../../src/auth/authUtils");

const router = express.Router()

//TODO authentication
router.get("/", asyncHandler(ticketController.findAllTicketAvailable))
module.exports = router