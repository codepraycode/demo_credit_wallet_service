
const error404 = ((req, res, next) => {
    const error = new Error("resource not found");

    error.status = 404;

    next(error);

});


const error500 = ((error, req, res, next) => {
    
    res.status(error.status || 500);

    const data = {
        message: "An error occured, please ensure your parameters are correct",
    }


    if ( Object.is(process.env.NODE_ENV, "development") ){
        data.stack = error.stack
        data.message = error.message
    }

    res.json(data);
});

module.exports = { error404, error500 };