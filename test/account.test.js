const assert = require('assert');
const expect = require('chai').expect;
const request = require('supertest');
const app = require('../server');


const { user1AccountData } = require('./test_data');

const endpoint = "/api/account";


describe("Unit testing /api/account route", () => {


    it("should return 422 on invalid creation data", function () {

        const { email, password, firstname } = user1AccountData;

        return request(app)
            .post(endpoint)
            .send({ email, password, firstname })
            .then((response) => {
                assert.equal(response.status, 422);
            })
    })

    it("should return 201 on created account", function () {

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


