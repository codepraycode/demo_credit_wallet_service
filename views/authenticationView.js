const asyncHandler = require('express-async-handler');
const UserAccountModel = require('../models/userAccountModel');

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

    const {email, password} = req.body;

    const user = await UserAccountModel.getUser({email});

    if(!user){
        return res.status(422).send({
            message:"User with email does not exist"
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