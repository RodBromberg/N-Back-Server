const { createUser } = require('../../../server/controllers/users/usersController');
const usersService = require('../../../server/services/users/usersService');

test('createUser should create a new user', async () => {
  // Mock the request object
  const email = process.env.EMAIL;
  const password = process.env.PASSWORD;
  
  const req = {
    body: {
      Email: email,
      Password: password,
    },
  };
  

  // Mock the usersService.createUser function
  const mockUser = { id: 1, email: 'test@example.com' };
  usersService.createUser = jest.fn().mockResolvedValue(mockUser);

  // Make a mock response object
  const res = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis()
  };

  // Call the createUser controller function
  await createUser(req, res);

  // Check if the response contains the mock user
  expect(res.status).toHaveBeenCalledWith(201);
  expect(res.json).toHaveBeenCalledWith(mockUser);
});

test('createUser should return an error when usersService.createUser throws an error', async () => {
  // Mock the request object
  const email = process.env.EMAIL;
  const password = process.env.PASSWORD;

  const req = {
    body: {
      Email: email,
      Password: password,
    },
  };


  // Mock the usersService.createUser function to throw an error
  usersService.createUser = jest.fn().mockRejectedValue(new Error('Database error'));

  // Make a mock response object
  const res = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis()
  };

  // Call the createUser controller function
  await createUser(req, res);

  // Check if the response contains the error message
  expect(res.status).toHaveBeenCalledWith(500);
  expect(res.json).toHaveBeenCalledWith({ error: 'Server error' });
});
