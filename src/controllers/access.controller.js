const AccessService = require("../services/access.service")
const { SuccessResponse, CREATED } = require('../core/success.response')
class AccessController {
    handlerRefreshToken = async (req, res, next) => {
        new SuccessResponse({
            message: "Get token Success",
            metadata: await AccessService.handlerRefreshToken(req.body.refreshToken)
        }).send(res)
    }

    logout = async (req, res, next) => {
        new SuccessResponse({
            message: "Logout Success",
            metadata: await AccessService.logout(req.keyStore)
        }).send(res)
    }
    login = async (req, res, next) => {
        new SuccessResponse({
            message: "Login Success",
            metadata: await AccessService.login(req.body)
        }).send(res)
    }
    signUp = async (req, res, next) => {
        new CREATED({
            message: 'Sign Up Success!',
            metadata: await AccessService.signUp(req.body),
        }).send(res)
    }
}

module.exports = new AccessController