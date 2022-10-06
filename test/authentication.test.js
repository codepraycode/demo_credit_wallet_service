const assert = require('assert');
const expect = require('chai').expect;
const request = require('supertest');
const app = require('../server');


const { authCredentials } = require('./test_data');


describe("Unit testing /api route", ()=>{

    it("should return 404 on unknown routes", function (){
        return request(app)
            .get("/api/something-strange")
            .then((response)=>{
                assert.equal(response.status, 404);
            })
    })



});




describe("Unit testing /api/authenticate route", () => {

    it("should return 404 on GET", function () {
        return request(app)
            .get("/api/authenticate/")
            .then((response) => {
                assert.equal(response.status, 404);
            })
    })


    it("should return 400 on Login without email", function () {

        const { email } = authCredentials;

        return request(app)
            .post("/api/authenticate/")
            .send({ email })
            .then((response) => {

                assert.equal(response.status, 400);
            })
    })

    it("should return 400 on Login without password", function () {

        const { password } = authCredentials;

        return request(app)
            .post("/api/authenticate/")
            .send({ password })
            .then((response) => {

                assert.equal(response.status, 400);
            })
    })

    it("should return 200 if authenticate", function () {

        return request(app)
            .post("/api/authenticate/")
            .send(authCredentials)
            .then((response) => {

                assert.equal(response.status, 200);
                expect(response.body).to.have.all.keys('access', 'refresh');

            })
    })
});


