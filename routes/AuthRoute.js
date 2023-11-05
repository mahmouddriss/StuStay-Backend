const express = require('express')
const router = express.Router()

const upload = require('../middlewares/upload')
const AuthController = require('../controllers/AuthController')


router.post('/register', upload.single('avatar'), AuthController.register)
router.post('/login', AuthController.login)
router.get('/logout', AuthController.logout)
router.put('/forgot-password', AuthController.forgot_password)
router.put('/reset-password', AuthController.reset_password)


module.exports = router