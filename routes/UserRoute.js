const express = require('express')
const router = express.Router()
const userController = require('../controllers/UserController')
const upload = require('../middlewares/avatar-storage');



router.post("/add", userController.add);
router.get('/all', userController.all);
router.delete("/destroy",userController.destroy);
router.get("/show",userController.show);

router.put('/profile', userController.updateProfile)
router.get('/search', userController.search)


router.post("/change-avatar", upload.single('image') , userController.changeAvatar);




module.exports = router