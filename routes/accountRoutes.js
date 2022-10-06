// Handles all the routes for user account

const express = require("express");

const router = express.Router();


// Views
const { createUserAccount, getUserAccount } = require('../views/accountView');


// Middlewares
const { ensureAuthenticated } = require('../middlewares/authentionMiddleware');

router.get('/', ensureAuthenticated);



router.route('/')
    .post(createUserAccount) // create account route
    .get(getUserAccount); // get user account route


module.exports = router;
