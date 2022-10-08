const assert = require('assert');
const expect = require('chai').expect;
const request = require('supertest');
const app = require('../server');


const { user1AccountData, authenticate } = require('./test_data');

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

describe("Unit testing /api/account route: get", () => {


    it("should return 400 on get account without token", async function () {

        const response = await request(app)
            .get(endpoint);
            
        assert.equal(response.status, 400);
    });

    it("should return account details", async function () {

        const token = await authenticate(app);
        assert.equal(typeof token, 'string');

        const response = await request(app)
            .get(endpoint)
            .set({Authorization: `Token ${token}`})

        assert.equal(response.status, 200);
    })

    
    

});


