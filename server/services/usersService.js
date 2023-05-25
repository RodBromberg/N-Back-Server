const bcrypt = require('bcrypt');
const usersRepository = require('../repositories/usersRepository')

const { DynamoDBClient, GetItemCommand } = require("@aws-sdk/client-dynamodb");
const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");

const region = "us-east-2"; // e.g., "us-west-2"

const dynamoDBClient = new DynamoDBClient({ region });



const sesClient = new SESClient({ region });

const getAllUsers = async () => {
  try {
    const users = await usersRepository.getAllUsers();
    return users;
  } catch (error) {
    throw new Error('Error retrieving users');
  }
};

const getUserById = async (userId) => {
  console.log('User ID:', userId); // Add this line

  try {
    const user = await usersRepository.getUserById(userId);
    console.log('User:', user); // Add this line
    return user;
  } catch (error) {
    throw new Error('Error retrieving user');
  }
};

const createUser = async (Email, Password) => {
  console.log({ Email, Password })
  try {
    const hashedPassword = await bcrypt.hash(Password, 10);
    const newUser = await usersRepository.createUser(Email, hashedPassword);

    // const emailParams = {
    //   Destination: {
    //     ToAddresses: [Email],
    //   },
    //   Message: {
    //     Body: {
    //       Text: {
    //         Data: `Please confirm your email by clicking on the following link: http://yourwebsite.com/confirm?token=${newUser.confirmationToken}`,
    //         Charset: "UTF-8"
    //       },
    //     },
    //     Subject: {
    //       Data: 'Please confirm your email',
    //       Charset: "UTF-8"
    //     },
    //   },
    //   Source: 'rod.bromberg@yahoo.com',
    // };

    // const sendEmailCommand = new SendEmailCommand(emailParams);
    // await sesClient.send(sendEmailCommand);

    return newUser;
  }catch (error) {
    throw new Error('Error creating user in Service: ' + error.message);
  }
};

const confirmUser = async (token) => {
  try {
    const user = await usersRepository.getUserByConfirmationToken(token);

    if (!user) {
      throw new Error('Invalid confirmation token.');
    }

    await usersRepository.confirmUser(user.userId);

    return user;
  } catch (error) {
    throw new Error('Error confirming user');
  }
};


const getUserByEmail = async (email) => {
  // 
  console.log('USERS',{ email })
  try {
    const user = await usersRepository.getUserByEmail(email);
    console.log({ user },'SERVICES')
    return user;
  } catch (error) {
    throw new Error('Error retrieving user by email');
  }
};

const comparePasswords = async (Password, hashedPassword) => {
  try {
    const PasswordMatch = await bcrypt.compare(Password, hashedPassword);
    return PasswordMatch;
  } catch (error) {
    throw new Error('Error comparing Passwords');
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  getUserByEmail,
  comparePasswords,
  confirmUser
};
