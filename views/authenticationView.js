const asyncHandler = require('express-async-handler');
const UserAccountModel = require('../models/userAccountModel');

// Login Account view


const loginAccount = asyncHandler(async (req, res, next) => {

    /*
        Data is already validated through the validation middleware
    */

    const {email, password} = req.body;

    const user = await UserAccountModel.getUser({email});

    if(!user){
        return res.status(422).send({
            message: "Incorrect email or password"
        });
    }

    const isPasswordCorrect = user.checkPassword(password, user.password);

    if(!isPasswordCorrect){
        return res.status(422).send({
            message: "Incorrect email or password"
        });
    }

    user.generateToken();


    return res.status(200).send({
        
        token:user.token
    });


});



module.exports = { loginAccount };