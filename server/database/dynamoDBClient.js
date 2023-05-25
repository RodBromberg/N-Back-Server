const { DynamoDBClient, ScanCommand, GetItemCommand, PutItemCommand } = require("@aws-sdk/client-dynamodb");

// Create a DynamoDB client
const dynamoDBClient = new DynamoDBClient({ region: 'us-east-2' });
