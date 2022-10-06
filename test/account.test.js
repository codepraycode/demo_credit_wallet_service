const assert = require('assert');
const expect = require('chai').expect;
const request = require('supertest');
const app = require('../server');


const { userAccountData } = require('./test_data');

const endpoint = "/api/account";


describe("Unit testing /api/account route", () => {


    it("should return 400 on invalid creation data", function () {

        const { email, password, firstname } = userAccountData;

        return request(app)
            .post(endpoint)
            .send({ email, password, firstname })
            .then((response) => {

                assert.equal(response.status, 400);
            })
    })

    it("should return 201 on created account", function () {

        return request(app)
            .post(endpoint)
            .send(userAccountData)
            .then((response) => {

                assert.equal(response.status, 201);
                // it must contain walletID
                expect(response.body).to.have.own.property("walletID").to.be.an("string")
            })
    })

});


