const { db, USERS_WALLET_TABLE_NAME } = require('../db/config');

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

    static async createWallet(user_id) {
        // Create user wallet
        const date = new Date();

        const walletID = Math.random().toString(36).substring(2);

        const balance = 0.00;

        const data = {
            walletID, user_id, balance,
            created_at: date, updated_at: date
        }

        // console.log(data);

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
        
        if(!wallet) return null;

        return new WalletModel(wallet);
    }


    async save (data){


        await db(USERS_WALLET_TABLE_NAME)
        .where({id:this.id})
        .update(data);
    }
    

    async topUpWallet ({amount, date}){
        // Increase user wallet balance
        let wallet = this; 

        const balance = wallet.balance + Number(amount);

        await wallet.save({balance, updated_at:date});

        wallet.balance = balance;
        wallet.updated_at = date;

    }

    async withdrawFromWallet ({amount, date}){
        // Deduct user wallet balance
        let wallet = this;

        if (wallet.balance < Number(amount)){

            const error = new Error("Insufficient funds")

            error.code = "INSUFFICIENT_FUNDS"
            error.status = 400

            throw error
        }

        const balance = wallet.balance - Number(amount);

        await wallet.save({ balance, updated_at: date });

        wallet.balance = balance;
        wallet.updated_at = date;
    }

    async transferFundsFromWallet ({recepientId, amount, date}){
        // Transfer funds from one wallet to another

        // Get receipient
        const receiving_wallet = await WalletModel.getWalletByQuery({ walletID: recepientId });
        
        if (!Boolean(receiving_wallet)) {

            const error = new Error(`Could not resolve receipient wallet, got wallet id:${recepientId}`)

            error.code = "UNRESOLVED_DESTINATION"
            error.status = 400

            throw error
        }

        
        const wallet = this;

        // First withdraw

        await wallet.withdrawFromWallet({ amount, date });

        await receiving_wallet.topUpWallet({ amount, date });

        return null

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
}

module.exports = WalletModel;