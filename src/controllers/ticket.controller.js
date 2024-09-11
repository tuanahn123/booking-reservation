const TicketServices = require("../services/ticket.service")
const { SuccessResponse } = require('../core/success.response')
const { TICKET_MESSAGE } = require("../constants/message")
class BookingController {
    findAllTicketAvailable = async (req, res, next) => {
        new SuccessResponse({
            message: TICKET_MESSAGE.GET_LIST_SUCCESS,
            metadata: await TicketServices.findAllTicketAvailable()
        }).send(res)
    }

}

module.exports = new BookingController