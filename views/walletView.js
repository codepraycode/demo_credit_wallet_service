const asyncHandler = require('express-async-handler');
const { WalletModel, TransactionModel, WALLET_FUND, WALLET_TRANSFER,
    WALLET_WITHDRAWAL } = require('../models/walletModel');

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
            - narration: string,
            - date: string
        Response: (200)
            - walletID: string
            - balance: string
            - lastUpdate: string,
            - transaction_type: "WALLET_FUND"
    */

    
    const {amount, date} = req.body;

    const wallet = req.wallet;

    const transaction = await wallet.topUpWallet({ amount:parseFloat(amount), date });

    return res.status(200).send({
        transaction:transaction.toJSON(),
        wallet:wallet.toJSON(),
    });


});

const walletTransfer = asyncHandler(async (req, res) => {

    /*
        METHOD: POST,
        DATA: 
            - walletId: string
            - recipientId: string,
            - amount: number,
            - narration: string,
            - date: string
        Response: (200)
            - walletID: string
            - balance: string
            - lastUpdate: string,
            - transaction_type: "WALLET_TRANSFER"
    */

    const { amount, ...rest } = req.body;

    const wallet = req.wallet;

    let transaction;

    try {
        transaction = await wallet.transferFundsFromWallet({
            amount: parseFloat(amount),
            ...rest
        });
    } catch (error) {
        return res.status(error.status || 400).send({
            message: error.message,
            code: error.code || ""
        })
    }


    return res.status(200).send({
        transaction: transaction.toJSON(),
        wallet: wallet.toJSON(),
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

    const wallet = req.wallet;
    let transaction;

    try{
        transaction = await wallet.withdrawFromWallet({
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
        transaction: transaction.toJSON(),
        wallet: wallet.toJSON(),
    });


});

const getTransactions = asyncHandler(async (req, res) => {

    /*
        METHOD: GET,
        Response: (200)
    */

    const user = req.user;

    const wallet = req.wallet;

    const { transaction_id } = req.params;

    if (Boolean(transaction_id)) {

        const transaction = await TransactionModel.getTransaction({
            user_id:user.id,
            wallet_id:wallet.id,
            id:transaction_id
        });

        if(!transaction){
            return res.status(404).send({
                message:"transaction record does not exist"
            })
        }

        return res.status(200).send(transaction.toJSON());

    }

    const transactions = await TransactionModel.getTransactions({
        user_id: user.id,
        wallet_id: wallet.id,
    });


    
    return res.status(200).send(TransactionModel.toJSON(transactions));


});


module.exports = { 
    getWallet, fundWallet, 
    walletTransfer, walletWithdraw,
    getTransactions, 
};