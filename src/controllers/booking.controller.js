const BookingServices = require("../services/booking.service")
const { SuccessResponse, CREATED } = require('../core/success.response')
const { BOOKING_MESSAGE } = require("../constants/message")
class BookingController {
    getAll = async (req, res, next) => {
        new SuccessResponse({
            message: BOOKING_MESSAGE.BOOKING_SUCCESS,
            metadata: await BookingServices.getAll({
                user_id: req.user.userId,
                ...req.query,
            })
        }).send(res)
    }
    create = async (req, res, next) => {
        new SuccessResponse({
            message: BOOKING_MESSAGE.BOOKING_SUCCESS,
            metadata: await BookingServices.create({
                user_id: req.user.userId,
                tickets: req.body.tickets,
            })
        }).send(res)
    }
    confirmReservation = async (req, res, next) => {
        new SuccessResponse({
            message: BOOKING_MESSAGE.CONFIRM_SUCCESS,
            metadata: await BookingServices.confirmReservation({
                user_id: req.user.userId,
                reservationId: req.params.id,
            })
        }).send(res)
    }
    cancelationReservation = async (req, res, next) => {
        new SuccessResponse({
            message: BOOKING_MESSAGE.CONFIRM_SUCCESS,
            metadata: await BookingServices.cancelationReservation({
                user_id: req.user.userId,
                reservationId: req.params.id,
            })
        }).send(res)
    }


}

module.exports = new BookingController