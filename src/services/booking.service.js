const { BOOKING_MESSAGE } = require('../constants/message');
const { BadRequestError } = require('../core/error.response');
const agenda = require('../dbs/agenda');
const cancellationModel = require('../models/cancellation.model');
const paymentModel = require('../models/payment.model');
const { checkTicketAvailable } = require('../models/repositories/ticket.repo');
const reservationModel = require('../models/reservation.model');
const ticketModel = require('../models/ticket.model');
const { convertToObjectIdMongodb } = require('../utils');
const timeAutomaticCancellation = 5
class BookingServices {
    static getAll = async ({ user_id, status, limit = 20, page = 1 }) => {
        page = page < 1 ? 1 : page;
        let query = { user_id: user_id }
        if (status) {
            query.status = status
        }
        const reservations = await reservationModel.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit((limit = limit > 20 ? 20 : limit))
            .populate({
                path: 'user_id',
                select: '-password -createdAt -updateAt -status'
            })
        const totalReservation = await reservationModel.find(query).countDocuments();
        const totalPage = Math.ceil(totalReservation / limit)
        return {
            reservations: reservations,
            totalReservation: totalReservation,
            totalPage: totalPage,
            page: +page
        }
    }
    // TODO 1: Check if the ticket is still available or not
    // TODO 2: Create a reservation with pending status
    // TODO 3: Update the remaining number of tickets after booking
    // TODO 4: Set up job to automatically cancel after expiration time (5 minutes)
    static create = async ({ user_id, tickets, res_expiry_time = timeAutomaticCancellation }) => {
        // TODO 1
        for (const ticket of tickets) {
            await checkTicketAvailable(ticket.ticket_id, ticket.quantity);
        }
        // TODO 2
        const newReservation = await reservationModel.create({
            user_id: user_id,
            tickets: tickets.map(ticket => ({
                ticket_id: ticket.ticket_id,
                quantity: ticket.quantity
            })),
            // TODO Convert expiration time from minutes to ms
            res_expiry_time: new Date(Date.now() + res_expiry_time * 60000)
        });

        // TODO 3
        for (const ticket of tickets) {
            const result = await ticketModel.findOneAndUpdate(
                { _id: ticket.ticket_id },
                { $inc: { tkt_remaining_quantity: -ticket.quantity } },
                { new: true }
            );

            // TODO: Check if the remaining quantity is 0, then update status to 'unAvailable'
            if (result.tkt_remaining_quantity === 0) {
                await ticketModel.updateOne(
                    { _id: ticket.ticket_id },
                    { $set: { status: 'unAvailable' } }
                );
            }
        }
        // TODO 4
        agenda.start();
        await agenda.schedule(new Date(Date.now() + res_expiry_time * 60000), 'cancel reservation', { reservationId: newReservation._id });

        return await reservationModel.findById(newReservation._id).populate('user_id tickets.ticket_id').lean()
    }
    static calculateReservationPrice = async (reservationId) => {
        const reservation = await reservationModel.findById(reservationId).populate('tickets.ticket_id').lean();
        if (!reservation) {
            throw new BadRequestError('Reservation not found');
        }
        let totalPrice = 0;
        for (const ticket of reservation.tickets) {
            const ticketDetails = await ticketModel.findById(ticket.ticket_id).lean();
            console.log(ticketDetails)
            if (!ticketDetails) {
                throw new BadRequestError(`Ticket not found for ID: ${ticket.ticket_id}`);
            }
            totalPrice += ticketDetails.tkt_price * ticket.quantity;
        }
        console.log(`Total price for reservation ${reservationId} is: ${totalPrice}`);
        return totalPrice;
    }
    // TODO 1: Calculate amount of reservation
    // TODO 2: Create payment  to 'completed' or 'failed'
    // TODO 3: Update reservation status to 'confirmed'
    static confirmReservation = async ({ userId, reservationId, method = "Credit Card" }) => {
        // TODO 1
        const amount = await this.calculateReservationPrice(reservationId)
        let paymentStatus = "completed"
        // TODO Call payment processing here (If it fails then PaymentStatus is 'failed')
        // TODO 2
        if (paymentStatus == "completed") {
            await paymentModel.create({
                user_id: userId,
                reservation_id: reservationId,
                pm_amount: amount,
                pm_method: method,
                status: paymentStatus
            });
            // TODO 3
            const updateReservation = reservationModel.findByIdAndUpdate(reservationId, { status: 'confirmed' }, { new: true }).populate('user_id').populate('tickets.ticket_id')
            return updateReservation
        }
        // TODO If it fails, still create a payment record so the user can pay again
    }

    static calculateReservationRefundPrice = async (reservationId) => {
        const reservation = await reservationModel.findById(reservationId).populate('tickets.ticket_id').lean();
        if (!reservation) {
            throw new BadRequestError('Reservation not found');
        }
        let totalPrice = 0;
        for (const ticket of reservation.tickets) {
            const ticketDetails = await ticketModel.findById(ticket.ticket_id).lean();
            console.log(ticketDetails)
            if (!ticketDetails) {
                throw new BadRequestError(`Ticket not found for ID: ${ticket.ticket_id}`);
            }
            totalPrice += ticketDetails.tkt_price * ticket.quantity;
        }
        const refundPrice = totalPrice * 0.9
        return refundPrice;
    }
    // TODO 1: Check if the system has returned 
    // TODO 1: Calculate refund_amount of reservation
    // TODO 2: Create cancellation to 'pending'
    // TODO 3: Update reservation to 'cancelled'
    // TODO 3: Update payment to 'refunded'
    // TODO 4: Update tickets to 'available' and increase remaining_quantity
    static cancelationReservation = async ({ userId, reservationId, method = "Credit Card" }) => {
        // TODO 1
        const foundReservation = await reservationModel.findById(reservationId).lean()
        if (foundReservation.status != "confirmed") {
            throw new BadRequestError(BOOKING_MESSAGE.REFUND_INVALID)
        }
        // TODO 1
        const amount = await this.calculateReservationRefundPrice(reservationId);
        // TODO 2
        let cancelStatus = "pending"
        await cancellationModel.create({
            user_id: userId,
            reservation_id: reservationId,
            refund_amount: amount,
            pm_method: method,
            status: cancelStatus
        });
        // TODO 3
        const updateReservation = await reservationModel.findByIdAndUpdate(reservationId, { status: 'cancelled' }, { new: true }).populate('user_id').populate('tickets.ticket_id')
        // TODO 4
        await paymentModel.updateOne({ reservationId: reservationId }, { status: 'refunded' }, { new: true });
        // TODO 5
        for (const ticket of updateReservation.tickets) {
            await ticketModel.findByIdAndUpdate(ticket.ticket_id,
                {
                    $inc: { tkt_remaining_quantity: ticket.quantity },
                    $set: { status: 'available' }
                },
                { new: true });
        }
        const newCancellation = await cancellationModel.findOne({ reservation_id: reservationId }).populate('user_id reservation_id')
        return newCancellation
    }
}
module.exports = BookingServices