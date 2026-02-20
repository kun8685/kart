const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

const errorHandler = (err, req, res, next) => {
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message;

    // Check for Mongoose bad ObjectId (CastError)
    if (err.name === 'CastError' && err.kind === 'ObjectId') {
        message = 'Resource not found or invalid ID format';
        statusCode = 404;
    }

    // Check for Mongoose Duplicate Key Error
    if (err.code === 11000) {
        const fieldName = Object.keys(err.keyValue)[0];
        message = `Duplicate field entered: ${fieldName}`;
        statusCode = 400;
    }

    // Check for Mongoose Validation Error
    if (err.name === 'ValidationError') {
        message = Object.values(err.errors).map(val => val.message).join(', ');
        statusCode = 400;
    }

    res.status(statusCode).json({
        message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

module.exports = { notFound, errorHandler };
