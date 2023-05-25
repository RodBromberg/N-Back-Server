// controllers/usersController.js
const usersService = require('../../services/users/usersService')

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await usersService.getAllUsers();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get a specific user by ID
const getUserById = async (req, res) => {
  try {
    const email = req.params.id; // Update parameter name to 'email'
    console.log({ email });
    const user = await usersService.getUserById(email); // Update parameter name to 'email'
    console.log({ user }, 'CONTROLLERS');
    if (!user) {
      res.status(404).json({ error: 'User not found controller' });
    } else {
      res.json(user);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};


// Create a new user
const createUser = async (req, res) => {
  try {
    const { Email, Password } = req.body;

    const checkIfExistingUser = await usersService.getUserByEmail(Email)

    if(checkIfExistingUser){
      return res.status(400).json({ err: 'Email already exists'})
    }

    const newUser = await usersService.createUser(Email, Password);
    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Add this new function in your usersController.js file
const confirmUser = async (req, res) => {
  const { token } = req.query;
  try {
    const user = await usersService.confirmUser(token);
    res.status(200).json({ message: 'User confirmed successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// User login
const loginUser = async (req, res) => {
  try {
    const { Email, Password } = req.body;
    const user = await usersService.getUserByEmail(Email);

    console.log({ Email, Password });
    console.log({ user });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const passwordMatch = await usersService.comparePasswords(Password, user.Password);

    if (passwordMatch) {
      res.json({ message: 'Login successful' });
    } else {
      res.status(401).json({ error: 'Invalid email or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};



module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  loginUser,
  confirmUser,  
};
