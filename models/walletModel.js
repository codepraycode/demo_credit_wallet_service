const { db, USERS_WALLET_TABLE_NAME, USERS_TRANSACTION_TABLE_NAME } = require('../db/config');


// Transaction types
const WALLET_FUND = "WALLET_FUND";
const WALLET_TRANSFER = "WALLET_TRANSFER";
const WALLET_WITHDRAWAL = "WALLET_WITHDRAWAL";
const UNRESOLVED_DESTINATION = "UNRESOLVED_DESTINATION";

class TransactionModel {

    constructor(transaction_data) { 
        const { id, wallet_id, user_id, 
            amount, description, transaction_type,
            transation_date, created_at, } = transaction_data;

        this.id = id
        this.wallet_id = wallet_id;
        this.user_id = user_id;
        this.amount = amount;
        this.description = description;
        this.transaction_type = transaction_type;
        this.transation_date = transation_date;
        this.timestamp = created_at;
    }


    toJSON() {
        // Serialize instance
        return {
            id: this.id,
            wallet_id: this.wallet_id,
            user_id: this.user_id,
            amount: this.amount,
            description: this.description,
            transaction_type: this.transaction_type,
            transation_date: this.transation_date,
            created_at: this.timestamp,
        }
    }

    static async createTransaction(data) {
        // Create user wallet transaction

        data.created_at = new Date();

        const [id] = await db(USERS_TRANSACTION_TABLE_NAME).insert(data, ['id']);

        return new TransactionModel({...data, id,});

    }

    static async getTransaction(query) {
        // Get a user WALLET
        const transactions = await db.select().from(USERS_TRANSACTION_TABLE_NAME).where(query);

        const transaction = transactions.at(0);

        if(!Boolean(transaction)) return null;

        return new TransactionModel(transaction);
    }

    static async getTransactions(query) {
        // Get a user WALLET
        const transactions = await db.select().from(USERS_TRANSACTION_TABLE_NAME).where(query);

        return transactions.map((each) => new TransactionModel(each));
    }

    static toJSON(transactions) {
        // transactions of type TransactionModel
        // serialize mutiple instances

        return transactions.map((transaction)=> transaction.toJSON())
    }
}


class WalletModel {

    constructor(wallet_data) { 
        const { id, walletID, user_id, balance, created_at, updated_at } = wallet_data;

        this.id = id
        this.walletID = walletID;
        this.user_id = user_id;
        this.balance = balance;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }

    async save (data){


        await db(USERS_WALLET_TABLE_NAME)
        .where({id:this.id})
        .update(data);
    }

    async delete(forReal = false) {
        // Delete user wallet
        const user_id = this.id;

        if (forReal) {
            await db(USERS_WALLET_TABLE_NAME).where({ user_id }).del();
            await db(USERS_TRANSACTION_TABLE_NAME).where({ user_id }).del();
        } else {
            await db(USERS_WALLET_TABLE_NAME).where({ user_id }).update({ deleted: true });
        }
    }

    async topUpWallet({ amount, date, narration }) {
        // Increase user wallet balance
        let wallet = this;

        const balance = wallet.balance + Number(amount);

        await wallet.save({ balance, updated_at: date });


        const transaction_data = {
            description: narration || 'account topup',
            transaction_type: WALLET_FUND,
            transation_date: new Date(date),
            user_id: this.user_id,
            wallet_id: this.id,
            amount: Number(amount),
        }

        const transaction = await TransactionModel.createTransaction(transaction_data);

        wallet.balance = balance;
        wallet.updated_at = date;

        return transaction;

    }

    async withdrawFromWallet({ amount, date, narration }) {
        // Deduct user wallet balance
        let wallet = this;

        if (wallet.balance < Number(amount)) {

            const error = new Error("Insufficient funds")

            error.code = "INSUFFICIENT_FUNDS"
            error.status = 400

            throw error
        }

        const balance = wallet.balance - Number(amount);

        await wallet.save({ balance, updated_at: date });

        const transaction_data = {
            description: narration || 'withdraw from account',
            transaction_type: WALLET_WITHDRAWAL,
            transation_date: new Date(date),
            user_id: this.user_id,
            wallet_id: this.id,
            amount: Number(amount),
        }

        const transaction = await TransactionModel.createTransaction(transaction_data);


        wallet.balance = balance;
        wallet.updated_at = date;

        return transaction;
    }

    async transferFundsFromWallet({ recipientId, amount, narration, date }) {
        // Transfer funds from one wallet to another

        // Get receipient
        const receiving_wallet = await WalletModel.getWalletByQuery({ walletID: recipientId });

        if (!Boolean(receiving_wallet)) {

            const error = new Error(`Could not resolve receipient wallet, got wallet id:${recipientId}`)

            error.code = UNRESOLVED_DESTINATION
            error.status = 400

            throw error
        }


        const wallet = this;

        // First withdraw

        const transaction = await wallet.withdrawFromWallet({ amount, narration, date });

        await receiving_wallet.topUpWallet({ amount, narration, date });

        transaction.transaction_type = WALLET_TRANSFER;

        return transaction

    }

    toJSON() {
        return {
            id: this.id,
            walletID: this.walletID,
            balance: this.balance,
            created_at: this.created_at,
            updated_at: this.updated_at
        }
    }

    static async createWallet(user_id) {
        // Create user wallet
        const date = new Date();

        const walletID = Math.random().toString(36).substring(2);

        const balance = 0.00;

        const data = {
            walletID, user_id, balance,
            created_at: date, updated_at: date
        }

        await db(USERS_WALLET_TABLE_NAME).insert(data);

        return new WalletModel(data);

    }

    static async getUserWallet(userId) {
        // Get a user WALLET
        const wallets = await db.select().from(USERS_WALLET_TABLE_NAME).where(`user_id`, userId);

        return new WalletModel(wallets.at(0));
    }

    static async getWalletByQuery(query) {
        // Get a user WALLET
        const wallets = await db.select().from(USERS_WALLET_TABLE_NAME).where(query);

        const wallet = wallets.at(0);

        if (!wallet) return null;

        return new WalletModel(wallet);
    }

    static async deleteWallet(user_id, forReal=false) {
        // Delete user data here
        if(forReal){
            await db(USERS_WALLET_TABLE_NAME).where({ user_id }).del();
            await db(USERS_TRANSACTION_TABLE_NAME).where({ user_id }).del();
        }else{
            await db(USERS_WALLET_TABLE_NAME).where({ user_id }).update({ deleted: true });
        }
    }
    
}

module.exports = { 
    WalletModel, TransactionModel,
    WALLET_FUND, WALLET_TRANSFER,
    WALLET_WITHDRAWAL, UNRESOLVED_DESTINATION
};