// This middleware is to validate requests data
// A middleware to check for required fields before proceeding

const validateAuthenticationData = (req, res, next) => {
    // email and password is required

    const { email, password } = req.body;


    // Validate that email and password was sent
    if (!Boolean(email) || !Boolean(password)) {
        return res.status(422).send({
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
        return res.status(422).send({
            message: "Email is required"
        })
    }
    
    if (!Boolean(password)) {
        return res.status(422).send({
            message: "Password is required"
        })
    }

    if (!Boolean(firstname)) {
        return res.status(422).send({
            message: "Firstname is required"
        })
    }

    if (!Boolean(lastname)) {
        return res.status(422).send({
            message: "Lastname is required"
        })
    }
    
    if (!Boolean(phonenumber)) {
        return res.status(422).send({
            message: "Phonenumber is required"
        })
    }

    next();

};

const validateFundOrWithdrawWalletData = (req, res, next) => {

    // Extract and check required fields
    const { amount, date } = req.body;

    if (!Boolean(amount)) {
        return res.status(422).send({
            message: "Amount is required"
        })
    }
    
    if (!Boolean(date)) {
        return res.status(422).send({
            message: "Date is required"
        })
    }

    const check_amount = parseFloat(amount);


    if (isNaN(check_amount) || check_amount <= 0.00) {
        // return error

        return res.status(422)
            .send({ message: `Invalid amount given, received ${amount}` });
    }
    

    next();

};


const validateWalletTransferData = (req, res, next) => {

    // Extract and check required fields
    const { recepientId, amount, naration, date } = req.body;

    if (!Boolean(amount)) {
        return res.status(422).send({
            message: "Amount is required"
        })
    }
    
    if (!Boolean(date)) {
        return res.status(422).send({
            message: "Date is required"
        })
    }
    
    if (!Boolean(recepientId)) {
        return res.status(422).send({
            message: "Recepient wallet id is required"
        })
    }
    
    if (!Boolean(naration)) {
        return res.status(422).send({
            message: "Transaction narration is required"
        })
    }

    const check_amount = parseFloat(amount);


    if (isNaN(check_amount) || check_amount <= 0.00) {
        // return error

        return res.status(422)
            .send({ message: `Invalid amount given, received ${amount}` });
    }

    next();

};

module.exports = { 
    validateAuthenticationData, validateCreateUserData,
    validateFundOrWithdrawWalletData, validateWalletTransferData
 };