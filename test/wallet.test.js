const assert = require('assert');
const expect = require('chai').expect;
const request = require('supertest');
const app = require('../server');

const {WALLET_FUND} = require('../models/walletModel');

const { fundWalletData, authenticate } = require('./test_data');

const get_wallet_endpoint = "/api/wallet";
const fund_wallet_endpoint = "/api/wallet/fund";


describe("Unit testing /api/wallet route: get", () => {


    it("should return 400 on wallet get when not authenticated", async function () {

        const response = await request(app)
            .get(get_wallet_endpoint);
        assert.equal(response.status, 400);
    })
    
    it("should return 200 on wallet get when authenticated", async () =>{

        const token = await authenticate(app);
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
    
    it("should return 200 on wallet fund when authenticated", async () =>{

        const token = await authenticate(app);
        expect(token).to.be.a('string');


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

