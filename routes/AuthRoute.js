const express = require('express')
const router = express.Router()

const upload = require('../middlewares/upload')
const AuthController = require('../controllers/AuthController')


router.post('/register', upload.single('avatar'), AuthController.register)



module.exports = router