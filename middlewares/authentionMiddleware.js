

const ensureAuthenticated = (req, res, next) => {
    // Token will be extracted from header
    // Authorization: Token < token-here >

    let token = req.headers['authorization'];

    const [token_name, token_value] = token.toLowerCase().split("token");

    // Check against token name
    if (!Object.is(token_name.trim(), "token")) {
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

    next();

}


module.exports = { ensureAuthenticated };