// Handles authentication routes

const express = require("express");

// Middleware
const { validateAuthenticationData } = require("../middlewares/validationMiddleware");

const router = express.Router();

// Apply middlewares
router.post('/', validateAuthenticationData);

// Views
const { loginAccount } = require('../views/authenticationView');


router.route('/').post(loginAccount) // login account route


module.exports = router;
