const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Product = require('../models/product');

router.get('/', (req, res,  next) => {
   Product.find()
   .select('name price _id')
   .exec()
   .then(data => {
       
       if(data.length > 0) {
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
       res.status(500).json({
            message:"Kesalahan Server",
            error: err
       });
   });
});

router.post('/', async (req, res, next) => {
    const session = await mongoose.startSession();
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });

    session.startTransaction();
    try {
        await product.save();

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
});

router.get('/:productID', (req, res, next) => {
    const id = req.params.productID;
    Product.findById(id)
    .select('name price _id')
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

router.delete('/:productID', (req, res, next) => {
    const id = req.params.productID;
    Product.remove({ _id:id })
    .exec()
    .then(data => {
        const response = {
            status: true,
            data: "Sukses Hapus Data"
        };

        res.status(200).json(response);
    })
    .catch(err => {
        res.status(500).json({
            message:"Kesalahan Server",
            error: err
       });
    });
});

router.post('/ubahData', async (req, res, next) => {
    const session = await mongoose.startSession();
    const id = req.body.id

    session.startTransaction();
    try {
        await Product.updateOne({ _id: id },{
            $set: {
                name: req.body.name,
                price: req.body.price
            }
        }).exec();

        await session.commitTransaction();

        res.status(200).json({
            status:true,
            data: "Sukses Update Data"
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
    // Product.updateOne({ _id: id },{
    //     $set: {
    //         name: req.body.name,
    //         price: req.body.price
    //     }
    // })
    // .exec()
    // .then(response => {
        // res.status(200).json({
        //     status:true,
        //     data: "Sukses Update Data"
        // });
    // })
    // .catch(err => {
    //     res.status(500).json({
    //         message:"Kesalahan Server",
    //         error: err
    //    });
    // });
});



module.exports = router;