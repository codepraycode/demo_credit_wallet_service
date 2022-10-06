// Handles authentication

const express = require("express");

const router = express.Router();


// Views
const { loginAccount } = require('../views/authenticationView');


router.route('/').post(loginAccount) // login account route


module.exports = router;
