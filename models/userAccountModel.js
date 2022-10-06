const bcrypt = require("bcryptjs");
const { db, USERS_TABLE_NAME } = require('../db/config');
const jwt = require('jsonwebtoken');

const SECRET = process.env.SECRET;

function encrptyPassword(password) {
    // Encrypt password and return encrypted version
    let salt = bcrypt.genSaltSync(10);
    let hashedPassword = bcrypt.hashSync(password, salt);

    return hashedPassword;
}

class UserAccountModel {

    constructor(user_data){

        const { id, firstname, lastname, phonenumber, email, password, created_at, updated_at } = user_data;

        this.id = id;
        this.firstname = firstname;
        this.lastname = lastname;
        this.phonenumber = phonenumber;
        this.email = email;
        this.password = password;
        this.created_at = created_at;
        this.updated_at = updated_at;

        this.token = null;
    }

    static async getUser(query){
        // Get a user by query
        // query is an object
        const users = await db.select().from(USERS_TABLE_NAME).where(query);

        return new UserAccountModel(users.at(0));
    }

    // static async getAllUsers (){
    //     // Get all users
    //     const users = await db.select().from(USERS_TABLE_NAME);

    //     const user = users.at(0);

    //     if(!Boolean(user)) return null;

    //     return new UserAccountModel(user);
    // }


    static async createUser(user_data){
        // Create user data here

        const { firstname, lastname, phonenumber, email, password } = user_data;

        const hashedPassword = encrptyPassword(password);

        const date = new Date();

        // await db.raw(`insert into ${USERS_TABLE_NAME}(firstname, lastname, phonenumber, email, password, created_at, updated_at) values(?, ?, ?, ?, ?, ?, ?)`,
        //     [ firstname, lastname, phonenumber, email, hashedPassword, date, date])


        await db(USERS_TABLE_NAME).insert(
            { firstname, lastname, phonenumber, 
                email, password:hashedPassword, 
                created_at: date, updated_at:date 
            },
        )

        return new UserAccountModel({ firstname, lastname, phonenumber, email, hashedPassword, created_at:date, updated_at:date });
        
    }
    
    checkPassword(password, hashedPassword){
        // check if password is correct

        return bcrypt.compareSync(password, hashedPassword);
    }

    static async checkAlreadyExists(fields){

        for (let [field, field_value] of Object.entries(fields) ) {

            let user = await db.select().from(USERS_TABLE_NAME).where({ [field]: field_value });
            
            if (Boolean(user) && user.length >= 1){

                return `User with ${field} already exist`;
            }
        };


        return null;
    }

    generateToken(){

        let user = this;

        let claim = {id:this.id, email:this.email, created_at:this.created_at.toISOString()};

        let token = jwt.sign(claim, SECRET, { algorithm: 'RS256' });

        this.token = token;
    }
    
    static async decodeToken(token){

        try {
            var decoded = jwt.verify(token, SECRET);

            const {id, email} = decoded;
            
            const user = await UserAccountModel.getUser({id, email});

            user.token = token;

            return [null,user]

        } catch (err) {
            // err
            return [err.message, null]
        }
    }


    toJSON(){
        return {
            id: this.id,
            firstname:this.firstname,
            lastname:this.lastname,
            phonenumber:this.phonenumber,
            email:this.email,
            // password:this.password,

            created_at: this.created_at,
            updated_at: this.updated_at
        }
    }
}

module.exports = UserAccountModel;