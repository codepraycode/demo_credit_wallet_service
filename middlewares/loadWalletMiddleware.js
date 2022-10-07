// const UserAccountModel = require("../models/userAccountModel");
const asyncHandler = require('express-async-handler');
const {WalletModel} = require("../models/walletModel");

// Loads the user wallet and injects it to request

const loadWallet = asyncHandler(async (req, res, next) => {

    user = req.user; // because it runs after auth verification

    const wallet = await WalletModel.getUserWallet(user.id);

    if(!Boolean(wallet)){
        return res.status(400).send({
            message:"Could not resolve wallet"
        });
    }

    req.wallet = wallet;

    next();

})


module.exports = { loadWallet };