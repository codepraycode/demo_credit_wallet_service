const asyncHandler = require('express-async-handler');
const WalletModel = require('../models/walletModel');

// User wallet view (authenticated user)


const getWallet = asyncHandler(async (req, res) => {

    /*
        METHOD: GET,
        Response: (200)
    */

    const user = req.user;

    const wallet = await WalletModel.getUserWallet(user.id);


    return res.status(200).send(wallet.toJSON());


});


const fundWallet = asyncHandler(async (req, res) => {

    /*
        METHOD: POST,
        DATA: 
            - walletId: string
            - amount: number,
            - naration: string,
            - date: string
        Response: (200)
            - walletID: string
            - balance: string
            - lastUpdate: string,
            - transaction_type: "WALLET_FUND"
    */

    
    const {amount, date} = req.body;
    const user = req.user;

    const wallet = await WalletModel.getUserWallet(user.id);

    await wallet.topUpWallet({ amount:parseFloat(amount), date });

    return res.status(200).send({
        ...wallet.toJSON(),
        transaction_type: "WALLET_FUND",
    });


});

const walletTransfer = asyncHandler(async (req, res) => {

    /*
        METHOD: POST,
        DATA: 
            - walletId: string
            - recepientId: string,
            - amount: number,
            - naration: string,
            - date: string
        Response: (200)
            - walletID: string
            - balance: string
            - lastUpdate: string,
            - transaction_type: "WALLET_TRANSFER"
    */

    const { amount, date, recepientId, naration } = req.body;
    const user = req.user;

    const wallet = await WalletModel.getUserWallet(user.id);

    try {
        await wallet.transferFundsFromWallet({
            amount: parseFloat(amount),
            date,
            recepientId
        });
    } catch (error) {
        return res.status(error.status || 400).send({
            message: error.message,
            code: error.code || ""
        })
    }


    return res.status(200).send({
        ...wallet.toJSON(),
        naration,
        transaction_type: "WALLET_TRANSFER",
    });


});

const walletWithdraw = asyncHandler(async (req, res) => {

    /*
        METHOD: POST,
        DATA: 
            - walletId: string
            - amount: number,
            - date: string
        Response: (200)
            - walletID: string
            - balance: string
            - lastUpdate: string,
            - transaction_type: "WALLET_WITHDRAWAL"
    */

    const { amount, date } = req.body;
    const user = req.user;

    const wallet = await WalletModel.getUserWallet(user.id);


    try{
        await wallet.withdrawFromWallet({
            amount: parseFloat(amount),
            date,
        });
    }catch (error){
        return res.status(error.status || 400).send({
            message: error.message,
            code: error.code || ""
        })
    }

    return res.status(200).send({
        ...wallet.toJSON(),
        transaction_type: "WALLET_WITHDRAWAL",
    });


});



module.exports = { 
    getWallet, fundWallet, 
    walletTransfer, walletWithdraw 
};