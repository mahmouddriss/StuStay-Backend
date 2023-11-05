const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const mailgun = require('mailgun-js');
const crypto = require('crypto');

const apikeyM = 'df9be2ebe5f925e0277d75db9406a12d';
const DOMAIN = 'sandbox4cd1220c92f147a59dd4f67dc891c702.mailgun.org';
const mg = mailgun({ apiKey: apikeyM, domain: DOMAIN });

const registerSchema = Joi.object({
    name: Joi.string().required(),
    last_name: Joi.string().required(),
    password: Joi.string().required(),
    email: Joi.string().email().required(),
    avatar: Joi.string().required(),
    age: Joi.number().required(),
    gender: Joi.string().required(),
    phone: Joi.string().required(),
    role: Joi.string().valid('admin', 'proprietaire', 'etudiant').required(),
});


const register = (req, res, next) => {
    const { error } = registerSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    bcrypt.hash(req.body.password, 10, function (err, hashedpass) {
        if (err) {
            res.status(500).json({
                error: err,
            });
        }

        let user = new User({
            name: req.body.name,
            last_name: req.body.last_name,
            password: hashedpass,
            email: req.body.email,
            avatar: req.body.avatar,
            age: req.body.age,
            gender: req.body.gender,
            phone: req.body.phone,
            role: req.body.role, // "admin", "proprietaire", "etudiant"
        });

        if (req.file) {
            user.avatar = req.file.path;
        }

        user.save()
            .then((user) => {
                res.status(200).json({
                    message: 'User Added Successfully',
                });
            })
            .catch((error) => {
                res.status(500).json({
                    message: 'An error Occurred!',
                });
            });
    });
};

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

const login = async (req, res, next) => {
    const { error } = loginSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    var email = req.body.email;
    var password = req.body.password;

    let user = await User.findOne({ email: email });

    if (user) {
        bcrypt.compare(password, user.password, function (err, result) {
            if (err) {
                res.status(500).json({
                    error: err,
                });
            }

            if (result) {
                const accessToken = generateAccessToken(user);
                const refreshToken = generateRefreshToken(user);

                user.token = accessToken;
                user.save();

                res.cookie('JWT', accessToken, {
                    httpOnly: true,
                });

                res.status(200).json({ user, accessToken, refreshToken });
            } else {
                res.status(400).json({
                    message: 'Password does not match!',
                });
            }
        });
    } else {
        res.status(404).json({
            message: 'No user found',
        });
    }
};

const logout = (req, res) => {
    res.clearCookie('JWT');
    res.clearCookie('Email');
    res.clearCookie('token');

    res.json({
        message: 'Successfully logout!',
    });
};

const forgot_password = (req, res) => {
    const { email } = req.body;

    User.findOne({ email })
        .then((user) => {
            if (!user) {
                return res.status(400).json({ error: 'User with this email does not exist.' });
            }

            const token = jwt.sign({ _id: user._id }, 'AzerTy,5()', { expiresIn: '20m' });
            res.cookie('resettoken', token);

            const data = {
                from: 'noreply@hello.com',
                to: email,
                subject: 'Password Reset Link',
                html: `  
                    <h2>Please click on the given link to reset your password</h2>
                    <p>http://localhost:3000/resetpassword/${token}</p> 
                `,
            };

            return user
                .updateOne({ resetLink: token })
                .then((success) => {
                    mg.messages().send(data, (error, body) => {
                        if (error) {
                            return res.status(500).json({ error: error.message });
                        }
                        return res.status(200).json({ message: 'Email has been sent' });
                    });
                })
                .catch((err) => {
                    return res.status(500).json({ error: 'Reset password link error' });
                });
        })
        .catch((err) => {
            return res.status(500).json({ error: 'An error occurred while finding the user.' });
        });
};

const reset_password = (req, res) => {
    const { newPass } = req.body;
    const resetLink = req.cookies.resettoken;

    if (!resetLink) {
        return res.status(401).json({ error: 'Authentication error!!!!' });
    }

    jwt.verify(resetLink, 'AzerTy,5()', (error, decodedData) => {
        if (error) {
            return res.status(401).json({
                error: 'Incorrect token or it is expired.',
                message: error.message,
            });
        }

        User.findOne({ _id: decodedData._id })
            .then((user) => {
                if (!user) {
                    return res.status(400).json({ error: 'User with this token does not exist.' });
                }

                bcrypt.hash(newPass, 10)
                    .then((hashedpass) => {
                        user.password = hashedpass;
                        user.resetLink = '';

                        user.save()
                            .then((result) => {
                                res.clearCookie('resettoken');

                                return res.status(200).json({ message: 'Your password has been changed' });
                            })
                            .catch((err) => {
                                return res.status(500).json({ error: 'Reset password error' });
                            });
                    })
                    .catch((err) => {
                        return res.status(500).json({ error: 'Error hashing the password' });
                    });
            })
            .catch((err) => {
                return res.status(500).json({ error: 'An error occurred while finding the user.' });
            });
    });
};

const generateRandomString = (length) => {
    return crypto.randomBytes(length).toString('hex');
};

const secretKey = generateRandomString(32); 
const refreshSecretKey = generateRandomString(32); 

console.log('Secret Key:', secretKey);
console.log('Refresh Secret Key:', refreshSecretKey);

const generateAccessToken = (user) => {
    return jwt.sign({ name: user.name }, secretKey , { expiresIn: '1h' });
};

const generateRefreshToken = (user) => {
    return jwt.sign({ name: user.name }, refreshSecretKey , { expiresIn: '7d' });
};


module.exports = {
    register,
    login,
    logout,
    forgot_password,
    reset_password,
};

