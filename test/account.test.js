const assert = require('assert');
const request = require('supertest');
const app = require('../server');
const {expect} = require('chai');


const { user1AccountData } = require('./test_data');
const UserAccountModel = require('../models/userAccountModel');

const endpoint = "/api/account";


describe("Unit testing /api/account route: create", () => {


    it("should return 422 on invalid creation data", function () {

        const { email, password, firstname } = user1AccountData;

        return request(app)
            .post(endpoint)
            .send({ email, password, firstname })
            .then((response) => {
                assert.equal(response.status, 422);
            })
    })   

    it("should return 201 on created account (expected)", function () {

        return request(app)
            .post(endpoint)
            .send(user1AccountData)
            .then((response) => {
                assert.equal(response.status, 201);
            })
    })

    it("should not create account with existing data", function () {

        return request(app)
            .post(endpoint)
            .send(user1AccountData)
            .then((response) => {
                assert.equal(response.status, 422);
            })
    })

});

describe("Unit testing /api/account route: get", () => {

    var user;

    before(async function () {
        const { email: user1Email } = user1AccountData;

        user = await UserAccountModel.getUser({ email: user1Email });

        user.generateToken();
    })

    it("should return 400 on get account details without auth token", async function () {

        const response = await request(app)
            .get(endpoint);
            
        assert.equal(response.status, 400);
    });

    it("should return account details with auth token (expected)", async function () {

        const {token} = user;
        expect(token).to.be.a("string");

        const response = await request(app)
            .get(endpoint)
            .set({Authorization: `Token ${token}`})

        assert.equal(response.status, 200);
        expect(response.body).to.have.property('id');
    })
});



