const asyncHandler = require('express-async-handler');


// Create Account view


const createUserAccount = asyncHandler( async( req, res ) =>{
    
    /*
        METHOD: POST,
        data:
            - firstname: string
            - lastname: string
            - email: string
            - password: string
        
        Response: (201)
            - firstname: string
            - lastname: string
            - email: string
            - password: string
            - dateCreated: date
            - walletID: string
    */


    const { firstname, lastname, email, } = req.body;

    return res.status(201).send({
        firstname,
        lastname,
        email,
        dateCreated: new Date().toISOString(),
        walletID: new Date().toDateString()
    });
    

});


const getUserAccount = asyncHandler( async( req, res, next) =>{
    
    /*
        METHOD: GET,
        Response: (200)
            - firstname: string
            - lastname: string
            - email: string
            - password: string
            - dateCreated: date
            - walletID: string
    */

    return res.status(200).send({
        firstname:"Lorem",
        lastname:"Ipsum",
        email:"lorem.ipsum@sample.com",
        dateCreated: new Date().toISOString(),
        walletID: new Date().toDateString()
    });
    
});


module.exports = { createUserAccount, getUserAccount };