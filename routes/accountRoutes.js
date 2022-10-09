// Handles all the routes for user account

const express = require("express");

// Views
const { createUserAccount, getUserAccount } = require('../views/accountView');

// Middlewares
const { ensureAuthenticated } = require('../middlewares/authentionMiddleware');
const { validateCreateUserData } = require("../middlewares/validationMiddleware");

const router = express.Router();

// Apply middlewares
router.get('/', ensureAuthenticated);
router.post('/', validateCreateUserData);



router.route('/')
    .post(createUserAccount) // create account route
    .get(getUserAccount); // get user account route


module.exports = router;
