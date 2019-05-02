const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productRoutes = require('./api/routes/products');
const ordersRoutes = require('./api/routes/orders');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

//HANLDE CORS
app.use((req,res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );

    if(req.method === 'OPTIONS'){
        res.header(
            'Access-Control-Allow-Methods', 
            'PUT, POST, DELETE, GET'
        );
        return res.status(200).json({});
    }

    next();
});

app.use('/products', productRoutes);
app.use('/orders', ordersRoutes);

mongoose.connect(
    'mongodb+srv://admin:'
    + process.env.MONGO_PW +
    '@order-app-2ygqf.mongodb.net/test?retryWrites=true',
    {
        useMongoClient:true
    }

);

//HANDLE ERROR IF ROUTE GAK ADA
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;