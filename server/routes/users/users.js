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

router.post('/login', usersController.loginUser);


// ... Other routes

module.exports = router;
