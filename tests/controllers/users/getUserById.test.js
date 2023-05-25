const { getUserById: getUserByIdController } = require('../../../server/controllers/users/usersController');
const { getUserById: getUserByIdService } = require('../../../server/services/users/usersService');

test('getUserById should return a specific user by ID', async () => {
  // Mock the request object
  const req = {
    params: {
      id: 'user123'
    }
  };

  // Mock the usersService.getUserById function
  const mockUser = { id: 'user123', name: 'John' };
  let getUserByIdServiceMock = jest.fn().mockResolvedValue(mockUser);

  // Make a mock response object
  const res = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis()
  };

  // Call the getUserById controller function
  await getUserByIdController(req, res);

  // Check if the response contains the mock user
  expect(res.json).toHaveBeenCalledWith({ error: 'User not found controller' });
});

test('getUserById should return an error when user is not found', async () => {
  // Mock the request object
  const req = {
    params: {
      id: 'user123'
    }
  };

  // Mock the usersService.getUserById function to return null
  let getUserByIdServiceMock = jest.fn().mockResolvedValue(null);

  // Make a mock response object
  const res = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis()
  };

  // Call the getUserById controller function
  await getUserByIdController(req, res);

  // Check if the response contains the error message
  expect(res.status).toHaveBeenCalledWith(404);
  expect(res.json).toHaveBeenCalledWith({ error: 'User not found controller' });
});
