const userModel = require("../models/user.model")
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const KeyTokenService = require("./keyToken.service");
const UserServices = require("./user.service")
const {
    createTokenPair, verifyJWT
} = require("../auth/authUtils");
const {
    getInfoData
} = require("../utils");
const {
    BadRequestError,
    AuthFailureError,
    ForBidenError
} = require("../core/error.response");

class AccessService {
    static handlerRefreshToken = async (refreshToken) => {
        const foundToken = await KeyTokenService.findByRefreshTokenUsed(refreshToken)
        if (foundToken) {
            const { userId } = await verifyJWT(refreshToken, foundToken.privateKey)
            // TODO Xóa tất cả token trong keys
            await KeyTokenService.deleteKeyById(userId)
            throw new ForBidenError('Something waring happened !! Please login again')
        }
        // TODO Chưa có
        const holderToken = await KeyTokenService.findByRefreshToken(refreshToken)
        if (!holderToken) throw new AuthFailureError('User not register')
        // TODO verifyToken
        const { userId, email } = await verifyJWT(refreshToken, holderToken.privateKey)
        // TODO check UserId
        const foundUser = UserServices.findByEmail({ email })
        if (!foundUser) throw new AuthFailureError('User not register')

        const tokens = await createTokenPair({ userId: foundUser._id, email }, holderToken.publicKey, holderToken.privateKey)

        await holderToken.updateOne(
            {
                $set: {
                    refreshToken: tokens.refreshToken
                },
                $addToSet: {
                    refreshTokenUsed: refreshToken // Da duoc su dung de lay token moi roi
                }
            }
        )
        return {
            user: { userId, email },
            tokens
        }

    }

    static logout = async (keyStore) => {
        const delKey = await KeyTokenService.removeKeyById(keyStore._id)
        return delKey
    }
    /*
        TODO 1-Check email 
        TODO 2-Match password 
        TODO 3-Create AT vs RT and save
        TODO 4-generate tokens
        TODO 5-get data return login 
    */
    static login = async ({ email, password, refreshToken = null }) => {
        // 1
        const foundUser = await UserServices.findByEmail({ email })
        if (!foundUser) throw new BadRequestError('User not registered')
        // 2
        const match = await bcrypt.compare(password, foundUser.password)
        if (!match) throw new AuthFailureError('Authentication Error !!')
        // 3
        const privateKey = crypto.randomBytes(64).toString('hex')
        const publicKey = crypto.randomBytes(64).toString('hex')
        // 4
        const tokens = await createTokenPair({ userId: foundUser._id, email }, publicKey, privateKey)
        await KeyTokenService.createKeyToken({
            userId: foundUser._id,
            refreshToken: tokens.refreshToken,
            privateKey, publicKey
        })
        return {
            user: getInfoData({
                fields: ['_id', 'name', 'email'],
                object: foundUser
            }),
            tokens
        }
    }

    static signUp = async ({
        name,
        email,
        password
    }) => {
        // TODO 1 Check email exits;
        const holderUser = await userModel.findOne({
            email
        }).lean();
        if (holderUser) {
            throw new BadRequestError('Error: User already registered!')
        }
        const passwordHash = await bcrypt.hash(password, 10);
        const newUser = await userModel.create({
            name,
            email,
            password: passwordHash,
        })
        if (newUser) {
            const privateKey = crypto.randomBytes(64).toString('hex')
            const publicKey = crypto.randomBytes(64).toString('hex')
            //Save collection KeyStore
            const keyStore = await KeyTokenService.createKeyToken({
                userId: newUser._id,
                publicKey,
                privateKey
            })
            if (!keyStore) {
                throw new BadRequestError('Error: Key Store Error!')

            }
            //TODO create token pair
            const tokens = await createTokenPair({
                userId: newUser._id,
                email
            }, publicKey, privateKey)
            return {
                code: 201,
                metadata: {
                    user: getInfoData({
                        fields: ['_id', 'name', 'email'],
                        object: newUser
                    }),
                    tokens
                }
            }
        }
    }
}

module.exports = AccessService