const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Order = require('../models/order');
const Product = require('../models/product');

router.get('/', (req, res,  next) => {
    Order.find()
   .select('product qty _id')
   .populate('product', 'name price')
   .exec()
   .then(data => {
    const awe = {
        Orders: data.map((rest) => {
            return {
                order_id: rest._id,
                qty:rest.qty,
                product:rest.product.name,
                price:rest.product.price,
                total: (rest.qty * rest.product.price)
            };
        })
    };
    res.status(200).json(awe);
    
    //    if(data.length > 0) {
    //     const response = {
    //         status: true,
    //         data: data
    //     };

    //     res.status(200).json(response);
    //    }else{
    //     const response = {
    //         status: false,
    //         data: "Data Tidak Di Temukan"
    //     };

    //     res.status(404).json(response); 
    //    }
   })
   .catch(err => {
       res.status(500).json({
            message:"Kesalahan Server",
            error: err
       });
   });
});

router.post('/', async (req, res, next) => {
    var status_product;

    Product.findById(req.body.productId)
    .exec()
    .then(data => {
        if(data){
            status_product = true;
            
        }else{
            status_product = false
        }

    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });

    if(status_product = true){
        const session = await mongoose.startSession();

        const order = new Order({
            _id: mongoose.Types.ObjectId(),
            qty: req.body.qty,
            product: req.body.productId
        })

        session.startTransaction();
        try {
            await order.save();

            await session.commitTransaction();

            res.status(200).json({
                status:true,
                data: "Sukses Input Data"
            });

            session.endSession();

        }catch(err) {
            await session.abortTransaction();
            session.endSession();
            res.status(500).json({
                message:"Kesalahan Server",
                error: err
            });
        } 
    }else{
        const response = {
            status: false,
            data: "Barang Yang Anda Masukan Tidak Di Temukan"
        };

        res.status(404).json(response); 
    }

      
});

router.get('/:orderID', (req, res, next) => {
    const id = req.params.orderID;
    Order.findById(id)
        .select('product qty _id')
        .populate('product', 'name')
        .exec()
        .then(data => {
            if(data){
                const response = {
                    status: true,
                    data: data
                };
        
                res.status(200).json(response);
            }else{
                const response = {
                    status: false,
                    data: "Data Tidak Di Temukan"
                };
        
                res.status(404).json(response); 
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

module.exports = router;