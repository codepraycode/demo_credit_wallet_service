const asyncHandler = require('express-async-handler');
const UserAccountModel = require('../models/userAccountModel');

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


    const { email, phonenumber } = req.body;

    // Check against record already exists
    const alreadyExist = await UserAccountModel.checkAlreadyExists({ email, phonenumber });

    if(alreadyExist){
        return res.status(400).send({ "message": alreadyExist });
    }

    const user = await UserAccountModel.createUser(req.body);

    return res.status(201).send(user.toJSON());
    

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