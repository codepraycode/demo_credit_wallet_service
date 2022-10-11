require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');
const helmet = require('helmet');
const morgan = require("morgan");
// const path = require('path');
// Swagger documentation

const swaggerUI = require('swagger-ui-express');
const openApiOptions = require("./swagger");

// =======================================================


// Routes
const authenticationRoutes = require('./routes/authenticationRoutes');
const accountRoutes = require('./routes/accountRoutes');
const walletRoutes = require('./routes/walletRoutes');

// Middlewares
const { error404, error500 } = require('./middlewares/errorsMiddleware');

// Handle Server Exceptions, and closes server
process.on("uncaughtException", (error)=>{
    console.log("UNCAUGHT EXCEPTION, SHUTTING DOWN SERVER!");
    console.log(error.message, error.name);
    console.log(error.stack);

    process.exit(1);
});

// Instantiating Express app
const app = express();

app.use(helmet());
app.use(bodyParser.json()); // Parse request bodies to JSON
app.use(cors()); // enable cors
app.use(morgan('common')); // enable request log
// app.use(express.urlencoded({ extended: false }));
// app.use(express.static(path.join(__dirname, 'static')));

// Routes
// app.use("/api", swaggerUI.serve, swaggerUI.setup(openApiOptions, {explorer:true}));
app.get("/api", ((req,res)=>{
    return res.send({
        message:"Welcome to Demo Credit Wallet Service"
    })
}));

app.use("/api/authenticate", authenticationRoutes);
app.use("/api/account", accountRoutes);
app.use("/api/wallet", walletRoutes);
app.use(error404); // incase of route not found
app.use(error500); // incase of runtime error

const PORT = process.env.PORT || 3010;
app.listen(PORT, ()=> console.log(`Server running on PORT: ${PORT}`));

module.exports = app;