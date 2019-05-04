const mongoose = require('mongoose');

const Order = require('../models/order');
const Product = require('../models/product');

exports.getAllOrders = (req, res,  next) => {
    Order.find()
   .select('product qty _id')
   .populate('product', 'name price')
   .exec()
   .then(data => {

       if(data.length > 0){
            const val = data.map((rest) => {
                return {
                    order_id: rest._id,
                    qty:rest.qty,
                    product:rest.product.name,
                    price:rest.product.price,
                    total: (rest.qty * rest.product.price)
                };
            })

            const response = {
                status: true,
                data: val
            };

            res.status(200).json(response);
       }
   
    
   })
   .catch(err => {
       res.status(500).json({
            message:"Kesalahan Server",
            error: err
       });
   });
}

exports.postNewOrders = async (req, res, next) => {
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
}

exports.getOrdersById = (req, res, next) => {
    const id = req.params.orderID;
    Order.findById(id)
    .select('product qty _id')
    .populate('product', 'name price')
    .exec()
    .then(data => {

        if(data){

            const val = {
                order_id: data._id,
                qty:data.qty,
                product:data.product.name,
                price:data.product.price,
                total: (data.qty * data.product.price)
            };

            const response = {
                status: true,
                data: val,
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
}

exports.deleteOrders = (req, res, next) => {
    const id = req.body.orderID;
    Order.remove({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json({
          message: 'Order Terhapus'
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
}