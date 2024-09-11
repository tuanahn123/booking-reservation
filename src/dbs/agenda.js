const Agenda = require('agenda');
const reservationModel = require('../models/reservation.model');
const ticketModel = require('../models/ticket.model');

// TODO Connect to MongoDB
const agenda = new Agenda({ db: { address: process.env.DB_CONNECT_STRING } });

// TODO Defined Cancel Reservation
agenda.define('cancel reservation', async (job, done) => {
    const { reservationId } = job.attrs.data;
    const foundReservation = await reservationModel.findById(reservationId).lean();
    if (foundReservation && foundReservation.status === 'pending') {
        // TODO Cancel booking and restore ticket quantity
        for (const ticket of foundReservation.tickets) {
            await ticketModel.updateOne(
                { _id: ticket.ticket_id },
                { $inc: { tkt_remaining_quantity: ticket.quantity } },
                { $set: { status: 'available' } }
            );
        }
        // TODO Update booking status to "cancelled"
        await reservationModel.updateOne(
            { _id: reservationId },
            { $set: { status: 'cancelled' } }
        );
    }
    done()
});

module.exports = agenda;