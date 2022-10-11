require("dotenv").config();
const swaggerJSDoc = require('swagger-jsdoc');

const PORT = process.env.PORT || 3010;

const swaggerDefinition = {
    openapi: "3.0.3",
    info: {
        title: "Demo Credit Wallet Service API",
        version: "1.0.0",
        description: "Demo credit wallet service API (interactive) documentation",
        contact: {
            name: "codepraycode",
            email: "preciousolusola16@gmail.com",
            url: "https:github.com/codepraycode"
        },
        servers: [
            {
                url: `http:localhost:${PORT}/api`,
                description:"Local server"
            }
        ],
        // tags: [
        //     {
        //         name:"Endpoints"
        //     }
        // ]
    },
}

const options = {
    swaggerDefinition,
    // path to OpenAPI definitions
    apis: ['./routes/*.js'],
}


const swaggerSpec = swaggerJSDoc(options);



module.exports = { swaggerSpec };