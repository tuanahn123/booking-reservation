const JWT = require('jsonwebtoken')
const asyncHandler = require('../helpers/asyncHandler')
const { AuthFailureError, NotFoundError } = require('../core/error.response')
const KeyTokenService = require('../services/keyToken.service')


const HEADER = {
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization'
}
const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        // AccessToken
        const accessToken = await JWT.sign(payload, publicKey, {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '2 days'
        })
        // RefreshToken
        const refreshToken = await JWT.sign(payload, privateKey, {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '7 days'
        })

        // Verify
        JWT.verify(accessToken, publicKey, (err, decode) => {
            if (err) {
                console.err('error verify', err)
            }
            else {
                console.log(`decode verify`, decode)
            }
        })
        return { accessToken, refreshToken }
    } catch (error) {
        console.log(error)
    }
}
const authentication = asyncHandler(async (req, res, next) => {
    /*
        ! 1- Check userId missing ?
        ! 2- Check keyStore with this UserId
        ! 3- Get accessToken
        ! 4- VerifyToken
        ! 5- Check user in dbs
        ! 6- Ok all => return next
     */
    //!1
    console.log(req.headers['x-client-id'])
    const userId = req.headers[HEADER.CLIENT_ID]
    if (!userId) throw new AuthFailureError('Invalid Request')
    //!2
    const keyStore = await KeyTokenService.findByUserId(userId)
    if (!keyStore) throw new NotFoundError('Not found keyStore')
    //!3
    const accessToken = req.headers[HEADER.AUTHORIZATION]
    console.log(accessToken)
    if (!accessToken) throw new AuthFailureError('Invalid Request')
    try {
        //!4
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey)
        //!5
        if (userId !== decodeUser.userId) throw new AuthFailureError('Invalid UserId')
        req.keyStore = keyStore
        req.user = decodeUser
        return next()
    } catch (error) {
        console.log(error)
        throw error
    }
})

const verifyJWT = async (token, keySecret) => {
    return await JWT.verify(token, keySecret)
}
module.exports = {
    createTokenPair,
    authentication,
    verifyJWT
}