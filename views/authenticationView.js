const asyncHandler = require('express-async-handler');


// Login Account view


const loginAccount = asyncHandler(async (req, res, next) => {

    /*
        METHOD: POST,
        data:
            - email: string
            - password: string
        
        Response: (200)
            - access: string
            - refresh: string
    */
    return res.status(200).send({
        
        access: new Date().toDateString(),
        refresh: new Date().toDateString()
    });


});



module.exports = { loginAccount };