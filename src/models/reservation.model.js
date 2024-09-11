const {
    model,
    Schema,
} = require('mongoose');

const DOCUMENT_NAME = 'Reservation';
const COLLECTION_NAME = 'Reservations'

const reservationSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        require: true,
        ref: 'User'
    },
    tickets: [
        {
            ticket_id: {
                type: Schema.Types.ObjectId,
                require: true,
                ref: 'Ticket'
            },
            quantity: {
                type: Number,
                min: 1,
                required: true
            }
        }
    ],
    res_expiry_time: {
        type: Date,
        required: true
    },
    res_confirmation_time: {
        type: Date,
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled'],
        default: 'pending'
    },
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

module.exports = model(DOCUMENT_NAME, reservationSchema)