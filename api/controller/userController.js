const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

const User = require("../models/user");

exports.signup = (req, res, next) => {

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
}

exports.login = (req, res, next) => {
    User.find({
        email:req.body.email
    })
    .exec()
    .then(response => {
        if(response.length < 1){
            return res.status(401).json({
                message: "Auth Failed !!"
            });
        }else{
            bcrypt.compare(req.body.password, response[0].password, (err, rest) => {
                if (err) {
                    return rest.status(401).json({
                        message: "Auth Failed !!"
                    });
                }

                if(rest){
                    const token = jwt.sign({
                        email: response[0].email,
                        userId: response[0]._id
                    },
                        process.env.JWT_KEY,
                        {
                            expiresIn: "1h"
                        } 
                    )
                    return res.status(200).json({
                        message: "Auth Successful",
                        token: token
                    });
                }

                return res.status(401).json({
                    message: "Auth Failed !!"
                });
            })
        }
    })
    .catch(err => {
        res.status(500).json({
            message:"Kesalahan Server",
            error: err
        });
    });
}