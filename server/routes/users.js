// routes/users.js
const express = require('express');
const router = express.Router();
const { DynamoDBClient, ScanCommand, GetItemCommand, PutItemCommand } = require("@aws-sdk/client-dynamodb");
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');


// Create a DynamoDB client
const dynamoDBClient = new DynamoDBClient({ region: 'us-east-2' });

// Get all users
router.get('/', async (req, res) => {
  try {
    const params = {
      TableName: 'N-Back-Users' // Replace with your table name
    };

    const command = new ScanCommand(params);
    const data = await dynamoDBClient.send(command);
    res.json(data.Items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get a specific user by ID
router.get('/:id', async (req, res) => {
  try {
    const params = {
      TableName: 'N-Back-Users',
      Key: {
        email: { S: req.params.id }
      }
    };

    const command = new GetItemCommand(params);
    const data = await dynamoDBClient.send(command);

    if (!data.Item) {
      res.status(404).json({ error: 'User not found' });
    } else {
      res.json(data.Item);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});
// Create a new user
router.post('/signup', async (req, res) => {
    try {
      const id = uuidv4(); // Generate a unique ID
      const email = req.body.Email;
      const password = req.body.Password;
  
      // Generate a salt to use for hashing
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
  
      // Hash the password with the generated salt
      const hashedPassword = await bcrypt.hash(password, salt);
  
      const params = {
        TableName: 'N-Back-Users',
        Item: {
          id: { S: id },
          Email: { S: email },
          Password: { S: hashedPassword },
        }
      };
  
      const command = new PutItemCommand(params);
      await dynamoDBClient.send(command);
  
      res.sendStatus(201);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  });

  router.post('/login', async (req, res) => {
    try {
      const email = req.body.Email;
      const password = req.body.Password;
  
      const params = {
        TableName: 'N-Back-Users',
        Key: {
          Email: { S: email }
        }
      };
  
      const command = new GetItemCommand(params);
      const data = await dynamoDBClient.send(command);

    //   console.log({ data })
    //   console.log({ command })
  
      if (!data.Item) {
        res.status(404).json({ error: 'User not found' });
      } else {
        const storedPassword = data.Item.Password.S;
  
        // Compare the stored hashed password with the provided password
        const passwordMatch = await bcrypt.compare(password, storedPassword);

        console.log({ password, storedPassword, passwordMatch})
  
        if (passwordMatch) {
          res.json({ message: 'Login successful' });
        } else {
          res.status(401).json({ error: 'Invalid email or password' });
        }
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  });
  
  
  

module.exports = router;
