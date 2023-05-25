// data access and storage

const { DynamoDBClient, ScanCommand, GetItemCommand, PutItemCommand, QueryCommand } = require("@aws-sdk/client-dynamodb");
const { v4: uuidv4 } = require('uuid');

const crypto = require('crypto');




const dynamoDBClient = new DynamoDBClient({ region: 'us-east-2' });

const getAllUsers = async () => {
  try {
    const params = {
      TableName: 'N-Back-Users' // Replace with your table name
    };
    const command = new ScanCommand(params);
    const data = await dynamoDBClient.send(command);
    return data.Items;
  } catch (error) {
    throw new Error('Error retrieving users');
  }
};


const getUserById = async (userId) => {
  try {
    console.log('Fetching user by userId:', userId);
    const params = {
      TableName: 'N-Back-Users',
      Key: {
        userId: { S: userId },
      },
    };

    const command = new GetItemCommand(params);
    const data = await dynamoDBClient.send(command);

    console.log('Data:', data);

    if (!data.Item) {
      console.log('User not found in repository');
      return null;
    }

    const user = {
      userId: data.Item.userId.S,
      Email: data.Item.Email.S,
      Password: data.Item.Password.S,
    };

    console.log('User:', user);
    return user;
  } catch (error) {
    console.error('Error retrieving user by userId:', error);
    throw new Error('Error retrieving user by userId');
  }
};

const createUser = async (Email, hashedPassword) => {
  try {
    const userId = uuidv4();
    const confirmationToken = uuidv4(); // Generate a new confirmation token
    const params = {
      TableName: 'N-Back-Users',
      Item: {
        userId: { S: userId },
        Email: { S: Email },
        Password: { S: hashedPassword },
        // uncomment when updating SES
        // Confirmed: { S: 'false' }, // Set Confirmed to false
        // ConfirmationToken: { S: confirmationToken }, // Add the confirmation token
      }
    };

    const command = new PutItemCommand(params);
    await dynamoDBClient.send(command);

    return {
      userId,
      Email,
      // confirmationToken,
    };
  } catch (error) {
    throw new Error('Error creating user in Repository: ' + error.message);
  }
};


const getUserByConfirmationToken = async (token) => {
  const params = {
    TableName: 'N-Back-Users',
    IndexName: 'ConfirmationToken-index',
    KeyConditionExpression: 'ConfirmationToken = :token',
    ExpressionAttributeValues: {
      ':token': { 'S': token },
    },
  };

  const command = new QueryCommand(params);
  const data = await dynamoDBClient.send(command);

  if (data.Items.length === 0) {
    return null;
  }

  const user = data.Items[0];
  return {
    userId: user.userId.S,
    Email: user.Email.S,
    Password: user.Password.S,
    Confirmed: user.Confirmed.S === 'true',
  };
};

const confirmUser = async (userId) => {
  const params = {
    TableName: 'N-Back-Users',
    Key: {
      'userId': { S: userId },
    },
    UpdateExpression: 'SET Confirmed = :confirmed',
    ExpressionAttributeValues: {
      ':confirmed': { 'S': 'true' },
    },
  };

  const command = new UpdateItemCommand(params);
  await dynamoDBClient.send(command);
};


const getUserByEmail = async (email) => {
  try {
    console.log('Fetching user by email:', email);
    const params = {
      TableName: 'N-Back-Users',
      IndexName: 'Email-index', // replace with your new index name
      KeyConditionExpression: 'Email = :email', // replace EmailIndex with Email
      ExpressionAttributeValues: {
        ':email': { 'S': email },
      },
    };

    const command = new QueryCommand(params);
    const data = await dynamoDBClient.send(command);

    console.log('Data:', data);

    if (!data.Items || data.Items.length === 0) {
      console.log('User not found in repository');
      return null;
    }

    const user = {
      userId: data.Items[0].userId.S,
      Email: data.Items[0].Email.S,
      Password: data.Items[0].Password.S,
    };

    console.log('User:', user);
    return user;
  } catch (error) {
    console.error('Error retrieving user by email:', error.message);
    throw new Error('Error retrieving user by email: ' + error.message);
  }  
};









// const getUserByEmail = async (email) => {
//   try {
//     console.log('Fetching user by email:', email);
//     const params = {
//       TableName: 'N-Back-Users',
//       Key: {
//         userId: { S: email }, // Use userId instead of Email
//       },
//     };

//     const command = new GetItemCommand(params);
//     const data = await dynamoDBClient.send(command);

//     console.log('Data:', {data});

//     if (!data.Item) {
//       console.log('User not found in repository');
//       return null;
//     }

//     const user = {
//       userId: data.Item.userId.S, // Use userId instead of id
//       Email: data.Item.Email.S,
//       Password: data.Item.Password.S,
//     };

//     console.log('User:', user);
//     return user;
//   } catch (error) {
//     console.error('Error retrieving user by email:', error);
//     throw new Error('Error retrieving user by email');
//   }
// };

// const getUserByEmail = async (email) => {
//   try {
//     console.log('Fetching user by email:', email);
//     const params = {
//       TableName: 'N-Back-Users',
//       IndexName: 'EmailIndex', // Specify the name of the secondary index
//       KeyConditionExpression: 'Email = :email', // Define the condition for the query
//       ExpressionAttributeValues: {
//         ':email': { S: email },
//       },
//     };

//     const command = new QueryCommand(params); // Use QueryCommand for querying by index
//     const data = await dynamoDBClient.send(command);

//     console.log('Data:', data);

//     if (!data.Items || data.Items.length === 0) {
//       console.log('User not found in repository');
//       return null;
//     }

//     // Assuming there is only one user with a given email
//     const user = {
//       userId: data.Items[0].userId.S,
//       Email: data.Items[0].Email.S,
//       Password: data.Items[0].Password.S,
//     };

//     console.log('User:', user);
//     return user;
//   } catch (error) {
//     console.error('Error retrieving user by email:', error);
//     throw new Error('Error retrieving user by email');
//   }
// };



// const getUserByEmail = async (email) => {
//   try {
//     console.log('Fetching user by email:', email);
//     const params = {
//       TableName: 'N-Back-Users',
//       IndexName: 'EmailIndex', // Specify the name of the global secondary index
//       KeyConditionExpression: 'Email = :email', // Use the email attribute in the condition expression
//       ExpressionAttributeValues: {
//         ':email': { S: email }, // Provide the email value for the condition
//       },
//     };

//     const command = new QueryCommand(params); // Use QueryCommand instead of GetItemCommand
//     const data = await dynamoDBClient.send(command);

//     console.log('Data:', data);

//     if (data.Items.length === 0) {
//       console.log('User not found in repository');
//       return null;
//     }

//     // Assuming there is only one user per email, retrieve the first item
//     const user = {
//       userId: data.Items[0].userId.S,
//       Email: data.Items[0].Email.S,
//       Password: data.Items[0].Password.S,
//     };

//     console.log('User:', user);
//     return user;
//   } catch (error) {
//     console.error('Error retrieving user by email:', error);
//     throw new Error('Error retrieving user by email');
//   }
// };









module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  getUserByEmail,
  confirmUser,
  getUserByConfirmationToken
};
