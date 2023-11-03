const User = require('../models/User')
const bcrypt = require('bcryptjs')



const register = (req, res, next) => {
  
    bcrypt.hash(req.body.password, 10, function (err, hashedpass) {

        if (err) {
            res.json({

                error: err
            })

        }
        let user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedpass,
            //fix
            avatar: req.body.avatar
        })
        if (req.file) {
            user.avatar = req.file.path
        }
        user.save()
            .then(user => {
                res.status(200).json({
                    message: 'user Added Successfully'
                })

            })
            .catch(error => {
                res.status(900).json({
                    message: 'An error Occured!'
                })
            })


    })
}


module.exports = {
    register
    
}
