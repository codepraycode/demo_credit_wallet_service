// Handles authentication routes

const express = require("express");
// Middleware
const { validateAuthenticationData } = require("../middlewares/validationMiddleware");
// Views
const { loginAccount } = require('../views/authenticationView');


const router = express.Router();


// Apply middlewares
router.post('/', validateAuthenticationData);


router.route('/').post(loginAccount) // login account route


module.exports = router;
