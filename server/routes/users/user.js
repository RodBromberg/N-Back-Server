// routes/users.js
const express = require('express');
const router = express.Router();
const usersController = require('../../controllers/users/usersController')
// Get all users
router.get('/', usersController.getAllUsers);

// Get a specific user by ID
router.get('/:id', usersController.getUserById);

// Create a new user
router.post('/signup', usersController.createUser);

// User login
router.post('/login', usersController.loginUser);

// Add this new route in your usersRoutes.js file
router.get('/confirm', usersController.confirmUser);


module.exports = router;
