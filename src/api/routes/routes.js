const express = require('express');

const router = express.Router();
const path = require('path');

const userController = require('../controllers/userController');
const recipesController = require('../controllers/recipesController');
const authMiddleware = require('../middlewares/auth');
const fileUpload = require('../middlewares/fileUpload');

router.post('/users', userController.createUser);
router.post('/login', userController.login);
router.post('/users/admin', authMiddleware, userController.createAdmin);

router.get('/recipes', recipesController.list);
router.get('/recipes/:id', recipesController.findOne);
router.post('/recipes', authMiddleware, recipesController.create);
router.put('/recipes/:id', authMiddleware, recipesController.edit);
router.delete('/recipes/:id', authMiddleware, recipesController.exclude);
router.put('/recipes/:id/image', fileUpload.single('image'),
 authMiddleware, recipesController.addImage);
router.use('/images', express.static(path.join(__dirname, '..', 'uploads')));

module.exports = router;