const UserAccountModel = require("../models/userAccountModel");
const asyncHandler = require('express-async-handler')

const ensureAuthenticated = asyncHandler(async(req, res, next) => {
    // Token will be extracted from header
    // Authorization: Token < token-here >

    let token = req.headers['authorization'];

    if(!Boolean(token)){
        return res.status(400).send({
            "message": "Authentication details not provided"
        });
    }

    const [token_name, token_value] = token.split(" ");

    // Check against token name
    if (!Object.is(token_name.toLowerCase().trim(), "token")) {
        // Invalid token error
        return res.status(400).send({
            "message": "Invalid authentication token"
        });
    }


    // Passed: is a valid token name
    // check against token value
    if (token_value.trim().length <= 1) {
        // Invalid token error
        return res.status(400).send({
            "message": "Invalid authentication token"
        });
    }

    const [error,user] = await UserAccountModel.decodeToken(token_value);

    if(Boolean(error)){
        return res.status(400).send({
            message:error
        });
    }

    req.user = user;

    next();

})


module.exports = { ensureAuthenticated };