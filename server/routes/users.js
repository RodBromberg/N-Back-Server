// routes/users.js
const express = require('express');
const router = express.Router();
const { DynamoDBClient,ScanCommand, GetItemCommand, PutItemCommand } = require("@aws-sdk/client-dynamodb");

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
router.post('/', async (req, res) => {
  try {
    const params = {
      TableName: 'N-Back-Users', 
      Item: {
        email: { S: req.body.email },
        password: { S: req.body.password },
        
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

module.exports = router;
