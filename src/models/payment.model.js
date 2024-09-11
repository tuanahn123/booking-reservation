const {
    model,
    Schema,
} = require('mongoose');

const DOCUMENT_NAME = 'Payment';
const COLLECTION_NAME = 'Payments'

const paymentSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        require: true,
        ref: 'Reservation'
    },
    reservation_id: {
        type: Schema.Types.ObjectId,
        require: true,
        ref: 'Reservation'
    },
    pm_amount: {
        type: Number,
        required: true
    },
    pm_method: {
        type: String,
        required: true
    },

    status: {
        type: String,
        enum: ['completed', 'failed', 'refunded'],
        default: 'pending'
    },
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

module.exports = model(DOCUMENT_NAME, paymentSchema)