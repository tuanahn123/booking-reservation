const keyTokenSchema = require("../models/keytoken.model")
const { Types } = require('mongoose')
class KeyTokenService {
    static createKeyToken = async ({
        userId,
        publicKey,
        privateKey,
        refreshToken
    }) => {
        try {
            const filter = { user: userId }, update = {
                publicKey, privateKey, refreshTokenUsed: [], refreshToken
            }, options = { upsert: true, new: true }
            const tokens = await keyTokenSchema.findOneAndUpdate(filter, update, options)
            return tokens ? tokens.publicKey : null
        } catch (error) {
            return {
                code: "TOKEN_CREATION_ERROR",
                message: error.message,
                status: 'error'
            }
        }
    }
    static findByUserId = async (userId) => {
        return await keyTokenSchema.findOne({ user: new Types.ObjectId(userId) }).lean()

    }
    static removeKeyById = async (id) => {
        return await keyTokenSchema.deleteOne(id);
    }
    static findByRefreshTokenUsed = async (refreshToken) => {
        return await keyTokenSchema.findOne({ refreshTokenUsed: refreshToken }).lean();
    }
    static findByRefreshToken = async (refreshToken) => {
        return await keyTokenSchema.findOne({ refreshToken: refreshToken });
    }
    static deleteKeyById = async (userId) => {
        return await keyTokenSchema.deleteOne({ user: userId });
    }
}
module.exports = KeyTokenService