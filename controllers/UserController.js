const express = require('express');
const User = require('../models/User');
const emailValidator = require('email-validator')

const all = (req, res, next) => {
    User.find()
        .then(response => {
            res.json({
                response
            })
        })
        .catch(error => {
            res.json({
                message: 'An error Occured!'
            })
        })
}

const show = (req, res, next) => {
    User.findById(req.header("userID"))
        .then(user => {
            res.json({
                user
            })
        }).catch(error => {
            res.json({
                message: 'An error Occured'
            })
        })
}

const add = (req, res, next) => {
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
        })
    if (emailValidator.validate(user.email)) {
        user.save()
            .then(response => {
                res.json({
                    message: 'user Added Successfully'
                })
  
            })
            .catch(error => {
                res.json({
                    message: 'An error Occured!'
                })
            })
  
    }
  else {
        res.json({
            message: 'wrong email adresse'
        })
    }
}

  const updateProfile = async (req, res, next) => {
 
    await User.findByIdAndUpdate(req.header("userID"),
        {
            $set: {
                name: req.body.name,
                email: req.body.email,
            }
        }
    )
  
    res.status(200).send("success")
}

  const changeAvatar = async (req, res) => {

    let user = await User.findByIdAndUpdate(req.header("UserID"),
        {
            $set: {
                avatar: req.file.filename
            }
        }
    );

    res.send({ user });
}

const destroy = (req, res, next) => {
    User.findByIdAndRemove(req.header("userID"))
        .then(() => {
            res.json({
                message: 'User deleted successfully!'
            })
        })
        .catch(error => {
            res.json({
                messaage: 'An error Occured'
            })
        })
}

const search = (req, res, next) => {
    var regex = new RegExp(req.body.name, 'i');
    User.find({ name: regex }).then((result) => {
        res.status(200).json(result)
    })

}

module.exports = {
    all,
    show,
    add,
    updateProfile,
    destroy,
    search,
    changeAvatar
    
}