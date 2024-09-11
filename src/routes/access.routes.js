const express = require("express");
const accessController = require("../controllers/access.controller");
const asyncHandler = require("../../src/helpers/asyncHandler");
const { authentication } = require("../../src/auth/authUtils");

const router = express.Router()

router.post("/signup", asyncHandler(accessController.signUp))
router.post("/login", asyncHandler(accessController.login))

//TODO authentication
router.use(authentication)
router.post("/handlerRefreshToken", asyncHandler(accessController.handlerRefreshToken))
router.post("/logout", asyncHandler(accessController.logout))
module.exports = router