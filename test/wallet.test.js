const assert = require('assert');
const expect = require('chai').expect;
const request = require('supertest');
const app = require('../server');

const { WALLET_FUND, WALLET_TRANSFER, UNRESOLVED_DESTINATION } = require('../models/walletModel');
const UserAccountModel = require('../models/userAccountModel');
const { WalletModel } = require('../models/walletModel');

const { user1AccountData, user2AccountData, fundWalletData, transferWalletData } = require('./test_data');

const get_wallet_endpoint = "/api/wallet";
const fund_wallet_endpoint = "/api/wallet/fund";
const transfer_wallet_endpoint = "/api/wallet/transfer";

describe("Unit testing for wallet: /api/wallet",()=>{

    var token, recipient_user;

    before(async function() {
        const {email:user1Email} = user1AccountData;
        // const { email: user2Email } = user2AccountData;

        const user1 = await UserAccountModel.getUser({email:user1Email});
        const user2 = await UserAccountModel.createUser(user2AccountData);
        const user2Wallet = await WalletModel.createWallet(user2.id);

        user1.generateToken()
        user2.wallet = user2Wallet;

        token = user1.token;

        recipient_user = user2;
    })

    after(async function() {
        
        const { wallet } = recipient_user;

        await UserAccountModel.deleteUser({ id: recipient_user.id }, true);
        wallet.delete(true);
    })

    describe("Unit testing /api/wallet route: get", () => {

        it("should return 400 on wallet get when not authenticated", async function () {

            const response = await request(app)
                .get(get_wallet_endpoint);
            assert.equal(response.status, 400);
        })

        it("should return 200 on wallet get when authenticated", async () => {

            expect(token).to.be.a('string');

            const response = await request(app)
                .get(get_wallet_endpoint)
                .set({ Authorization: `Token ${token}` })

            assert.equal(response.status, 200);
            expect(response.body).to.have.property('walletID');
            expect(response.body).to.have.property('balance');
        })

    });


    describe("Unit testing /api/wallet route: fund", () => {

        it("should return 400 on wallet fund when not authenticated", async function () {

            const response = await request(app)
                .post(fund_wallet_endpoint)
                .send(fundWalletData);
            assert.equal(response.status, 400);
        })

        it("should return 200 on wallet fund when authenticated", async () => {

            const response = await request(app)
                .post(fund_wallet_endpoint)
                .send(fundWalletData)
                .set({ Authorization: `Token ${token}` })

            assert.equal(response.status, 200);
            expect(response.body).to.have.property('transaction');
            expect(response.body).to.have.property('wallet');
            expect(response.body).to.have.nested.property('transaction.transaction_type', WALLET_FUND);
        })

    });


    describe("Unit testing /api/wallet route: transfer", () => {

        it("should return 400 on wallet transfer when not authenticated", async function () {

            const response = await request(app)
                .post(transfer_wallet_endpoint)
                .send(transferWalletData);
            assert.equal(response.status, 400);
        })

        it("should return 422 on wallet transfer without recipient", async function () {

            expect(token).to.be.a('string');

            const response = await request(app)
                .post(transfer_wallet_endpoint)
                .send(transferWalletData)
                .set({ Authorization: `Token ${token}` });

            assert.equal(response.status, 422);
        })

        it("should return 422 on wallet transfer with recipient without narration", async () => {

            expect(token).to.be.a('string');
            expect(recipient_user).to.have.nested.property('wallet.walletID').to.be.a('string');


            const transacting_data = {
                ...transferWalletData,
                recipientId: recipient_user.wallet.walletID,
                // no narration
            }

            const response = await request(app)
                .post(transfer_wallet_endpoint)

                .send(transacting_data)
                .set({ Authorization: `Token ${token}` })

            assert.equal(response.status, 422);
        })

        it("should return 400 on wallet transfer with unknown recipient", async function () {

            expect(token).to.be.a('string');

            const transacting_data = {
                ...transferWalletData,
                recipientId: "udasdfkjnjnsdf", // fake walletID
                narration: "Testing fake destination transfer" // with narration
            }

            const response = await request(app)
                .post(transfer_wallet_endpoint)
                .send(transacting_data)
                .set({ Authorization: `Token ${token}` });

            assert.equal(response.status, 400);
            expect(response.body).to.have.property('message');
            expect(response.body).to.have.property('code', UNRESOLVED_DESTINATION);
        })

        it("should return 200 on wallet transfer with recipient (expected)", async () => {

            expect(token).to.be.a('string');
            expect(recipient_user).to.have.nested.property('wallet.walletID').to.be.a('string');


            const transacting_data = { 
                ...transferWalletData, 
                recipientId: recipient_user.wallet.walletID,
                narration:"Testing transfer" // with narration
            }

            const response = await request(app)
                .post(transfer_wallet_endpoint)
                
                .send(transacting_data)
                .set({ Authorization: `Token ${token}` })

            assert.equal(response.status, 200);
            expect(response.body).to.have.property('transaction');
            expect(response.body).to.have.property('wallet');
            expect(response.body).to.have.nested.property('transaction.transaction_type', WALLET_TRANSFER);
        })

    });

})

