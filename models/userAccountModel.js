const bcrypt = require("bcryptjs");
const { db, USERS_TABLE_NAME } = require('../db/config');

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
    }

    static async getUser(query){
        // Get a user by query
        // query is an object
        const user = await db.select().from(USERS_TABLE_NAME).where(query);

        return user;
    }

    static async getAllUsers (){
        // Get all users
        const users = await db.select().from(USERS_TABLE_NAME);

        return users;
    }


    static async createUser(user_data){
        // Create user data here

        const { firstname, lastname, phonenumber, email, password } = user_data;

        const hashedPassword = encrptyPassword(password);

        const date = new Date();

        await db.raw(`insert into ${USERS_TABLE_NAME}(firstname, lastname, phonenumber, email, password, created_at, updated_at) values(?, ?, ?, ?, ?, ?, ?)`,
            [ firstname, lastname, phonenumber, email, hashedPassword, date, date])


        return new UserAccountModel({ firstname, lastname, phonenumber, email, hashedPassword});
        
    }
    
    static checkPassword(password, hashedPassword){
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


    toJSON(){
        return {
            id: this.id,
            firstname:this.firstname,
            lastname:this.lastname,
            phonenumber:this.phonenumber,
            email:this.email,
            password:this.password,

            created_at: this.created_at,
            updated_at: this.updated_at
        }
    }
}

module.exports = UserAccountModel;