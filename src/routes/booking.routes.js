const express = require("express");
const bookingController = require("../controllers/booking.controller");
const asyncHandler = require("../../src/helpers/asyncHandler");
const { authentication } = require("../../src/auth/authUtils");

const router = express.Router()

//TODO authentication
router.use(authentication)
router.get("/", asyncHandler(bookingController.getAll))
router.post("/", asyncHandler(bookingController.create))
router.post("/confirm/:id", asyncHandler(bookingController.confirmReservation))
router.post("/cancel/:id", asyncHandler(bookingController.cancelationReservation))
module.exports = router