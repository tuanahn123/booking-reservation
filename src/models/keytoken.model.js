const {
    Schema,
    model
} = require('mongoose');

const DOCUMENT_NAME = 'Key';
const COLLECTION_NAME = 'Keys'

var keyTokenSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        require: true,
        ref: 'User'
    },
    publicKey: {
        type: String,
        required: true,
    },
    privateKey: {
        type: String,
        required: true,
    },
    refreshTokenUsed: {
        type: Array,
        default: [] // Những RT đã được sử dụng
    },
    refreshToken: {
        type: String,
        required: true,
    },
}, {
    collection: COLLECTION_NAME,
    timestamps: true
});

module.exports = model(DOCUMENT_NAME, keyTokenSchema);