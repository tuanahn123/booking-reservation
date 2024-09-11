const userModel = require("../models/user.model")

class UserServices {
    static findByEmail = async ({ email, select = {
        email: 1, password: 1, name: 1, status: 1, role: 1
    } }) => {
        return await userModel.findOne({ email }).select(select).lean()
    }
}
module.exports = UserServices