const {
    model,
    Schema,
} = require('mongoose');

const DOCUMENT_NAME = 'Ticket';
const COLLECTION_NAME = 'Tickets'

const ticketSchema = new Schema({
    tkt_name: {
        type: String,
        unique: true,
        trim: true
    },
    tkt_price: {
        type: Number,
        require: true
    },
    tkt_total_quantity: {
        type: Number,
        require: true
    },
    tkt_remaining_quantity: {
        type: Number,
        require: true
    },
    tkt_seat: {
        type: String,
        require: true
    },
    tkt_start_date: {
        type: Date,
        require: true
    },
    tkt_end_date: {
        type: Date,
        require: true
    },
    status: {
        type: String,
        enum: ['available', 'unAvailable'],
        default: 'available'
    },
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

module.exports = model(DOCUMENT_NAME, ticketSchema)