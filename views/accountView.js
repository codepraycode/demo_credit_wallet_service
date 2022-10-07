const asyncHandler = require('express-async-handler');
const UserAccountModel = require('../models/userAccountModel');
const WalletModel = require('../models/walletModel');

// Create Account view


const createUserAccount = asyncHandler( async( req, res ) =>{
    
    /*
        METHOD: POST,
        Response: (201)
    */


    const { email, phonenumber } = req.body;

    // Check against record already exists
    const alreadyExist = await UserAccountModel.checkAlreadyExists({ email, phonenumber });

    if(alreadyExist){
        return res.status(422).send({ "message": alreadyExist });
    }

    const user = await UserAccountModel.createUser(req.body);

    await WalletModel.createWallet(user.id);

    return res.status(201).send(user.toJSON());
    

});


const getUserAccount = asyncHandler( async( req, res, next) =>{
    
    /*
        METHOD: GET,
        Response: (200)
    */


    const user = req.user;

    return res.status(200).send(user.toJSON());
    
});


module.exports = { createUserAccount, getUserAccount };