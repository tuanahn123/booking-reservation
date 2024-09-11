const {
    model,
    Schema,
} = require('mongoose');

const DOCUMENT_NAME = 'User';
const COLLECTION_NAME = 'Users'

const userSchema = new Schema({
    name: {
        type: String,
        trim: true,
        maxLength: 150
    },
    email: {
        type: String,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        require: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'inactive'
    },
    roles: {
        type: String,
        default: 'user',
        enum: ['user', 'admin']
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

module.exports = model(DOCUMENT_NAME, userSchema)