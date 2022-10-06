const asyncHandler = require('express-async-handler');


// User wallet view (authenticated user)


const getWallet = asyncHandler(async (req, res, next) => {

    /*
        METHOD: GET,
        PARAMS: 
            - walletId: string 
        Response: (200)
            - walletID: string
            - balance: string
            - lastUpdate: string
    */

    return res.status(200).send({
        walletID: new Date().toDateString(),
        balance:0.00,
        lastUpdate: new Date().toISOString(),
    });


});


const fundWallet = asyncHandler(async (req, res, next) => {

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

    return res.status(200).send({
        walletID: new Date().toDateString(),
        balance:0.00,
        lastUpdate: new Date().toISOString(),
        transaction_type: "WALLET_FUND",
    });


});

const walletTransfer = asyncHandler(async (req, res, next) => {

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

    return res.status(200).send({
        walletID: new Date().toDateString(),
        balance:0.00,
        lastUpdate: new Date().toISOString(),
        transaction_type: "WALLET_TRANSFER",
    });


});

const walletWithdraw = asyncHandler(async (req, res, next) => {

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

    return res.status(200).send({
        walletID: new Date().toDateString(),
        balance:0.00,
        lastUpdate: new Date().toISOString(),
        transaction_type: "WALLET_WITHDRAWAL",
    });


});



module.exports = { getWallet, fundWallet, walletTransfer, walletWithdraw };