
const error404 = ((req, res, next) => {
    const error = new Error("Not found");

    error.status = 404;

    next(error);

});


const error500 = ((error, req, res, next) => {
    
    res.status(error.status || 500);

    res.json({
        message: error.message,
        // stack: process.env.NODE_ENV === "production" ? "Error in your request" : error.stack,
    });
});


module.exports = { error404, error500 };