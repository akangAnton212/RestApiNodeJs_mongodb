const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require("../models/user");

router.post('/signup', (req, res, next) => {

    //cek user
    User.find({
        email: req.body.email
    })
    .exec()
    .then(result => {
        if(result.length > 0){
            return res.status(422).json({
                message: "Email SUdah Ada"
            });
        }else{
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) {
                    return res.status(500).json({
                        error: err
                    });
                }else{
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password: hash
                    })
        
                    user
                        .save()
                        .then(response => {
                            res.status(200).json({
                                status:true,
                                data: "Sukses Input Data",
                                response:response
                            });
                        })
                        .catch(err => {
                            res.status(500).json({
                                message:"Kesalahan Server",
                                error: err
                            });
                        });
                }
            })
        }
    })
    .catch(err => {
        res.status(500).json({
            message:"Kesalahan Server",
            error: err
        });
    });
});

module.exports = router;