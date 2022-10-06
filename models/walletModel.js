
class WalletModel {

    constructor() { }

    static createWallet(userId) {
        // Create user wallet
    }

    static getWallet(userId) {
        // Get a user WALLET
    }


    static topUpWallet ({walletID, amount}){
        // Increase user wallet balance
    }

    static withdrawFromWallet ({walletID, amount}){
        // Deduct user wallet balance
    }

    static transferFundsFromWallet ({walletID, recepient, amount, narration}){
        // Transfer funds from one wallet to another
    }
}

module.exports = WalletModel;