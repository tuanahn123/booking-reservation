const ticketModel = require("../models/ticket.model")

class TicketServices {
    static findAllTicketAvailable = async () => {
        return await ticketModel.find({ status: "available" }).lean()
    }
}
module.exports = TicketServices