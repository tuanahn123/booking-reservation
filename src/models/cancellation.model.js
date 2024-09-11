const {
    model,
    Schema,
} = require('mongoose');

const DOCUMENT_NAME = 'Cancellation';
const COLLECTION_NAME = 'Cancellations'

const cancellationSchema = new Schema({
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
    refund_amount: {
        type: Number,
        required: true
    },
    pm_method: {
        type: String,
        required: true
    },

    status: {
        type: String,
        enum: ['pending', 'completed'],
        default: 'pending'
    },
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

module.exports = model(DOCUMENT_NAME, cancellationSchema)