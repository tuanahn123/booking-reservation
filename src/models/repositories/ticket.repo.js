const { BOOKING_MESSAGE } = require('../../constants/message')
const { BadRequestError } = require('../../core/error.response')
const ticketModel = require('../ticket.model')

const checkTicketAvailable = async (ticket_id, quantity) => {
    const foundTicket = await ticketModel.findById(ticket_id).select('tkt_remaining_quantity').lean()
    if (new Date() > new Date(foundTicket.tkt_end_date)) {
        throw new BadRequestError(BOOKING_MESSAGE.TICKET_EXPIRED);
    }
    if (!foundTicket) {
        throw new BadRequestError(BOOKING_MESSAGE.TICKET_NOT_EXIST)
    }
    if (foundTicket.tkt_remaining_quantity < quantity) {
        throw new BadRequestError(BOOKING_MESSAGE.INSUFFICIENT_QUANTITY)
    }
    return true
}

module.exports = { checkTicketAvailable }