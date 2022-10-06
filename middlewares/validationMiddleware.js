// This middleware is to validate requests data
// A middleware to check for required fields before proceeding

const UserAccountModel = require("../models/userAccountModel");

const validateAuthenticationData = (req, res, next) => {
    // email and password is required

    const { email, password } = req.body;


    // Validate that email and password was sent
    if (!Boolean(email) || !Boolean(password)) {
        return res.status(400).send({
            message: "Email or password is required"
        })
    }

    next();

};


const validateCreateUserData = (req, res, next) => {
    // email and password is required

    const { firstname, lastname, email, password, phonenumber } = req.body;


    // Validate that email and password was sent
    if (!Boolean(email)) {
        return res.status(400).send({
            message: "Email is required"
        })
    }
    
    if (!Boolean(password)) {
        return res.status(400).send({
            message: "Password is required"
        })
    }

    if (!Boolean(firstname)) {
        return res.status(400).send({
            message: "Firstname is required"
        })
    }

    if (!Boolean(lastname)) {
        return res.status(400).send({
            message: "Lastname is required"
        })
    }
    
    if (!Boolean(phonenumber)) {
        return res.status(400).send({
            message: "Phonenumber is required"
        })
    }

    next();

};


module.exports = { validateAuthenticationData, validateCreateUserData };