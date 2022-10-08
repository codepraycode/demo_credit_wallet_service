
const request = require('supertest');
const authCredentials = { email: "lorem.ipsum@sample.com", password: "letmein" };

const user1AccountData = {
    firstname: "Lorem",
    lastname: "Ipsum",
    email: "lorem.ipsum@sample.com",
    password:"letmein",
    phonenumber:"+234 800000000"
 };

 const user2AccountData = {
    firstname: "Lorem",
    lastname: "Ipsum",
    email: "lorem1234.ipsum@sample.com",
    password:"letmein3",
    phonenumber:"+234 80343000000"
 };
 
 
 const fundWalletData = {
    amount:5000,
    date:"2020-10-10",
 };


const endpoint = "/api/authenticate";

async function authenticate(app) {
    const res = await request(app)
        .post(endpoint)
        .send(authCredentials)

    return res.body.token;
}

module.exports = {
    authCredentials, user2AccountData,
    user1AccountData, fundWalletData, authenticate };
