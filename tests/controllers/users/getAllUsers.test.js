const { getAllUsers } = require('../../../server/controllers/users/usersController');
const usersService = require('../../../server/services/users/usersService');

// Store the original console.error function and replace it with a mock
const originalConsoleError = console.error;
console.error = jest.fn();

test('getAllUsers should return all users', async () => {
  // Mock the usersService.getAllUsers function
  const mockUsers = [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }];
  usersService.getAllUsers = jest.fn().mockResolvedValue(mockUsers);

  // Make a mock request and response object
  const req = {};
  const res = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis()
  };

  // Call the getAllUsers controller function
  await getAllUsers(req, res);

  // Check if the response contains the mock users
  expect(res.json).toHaveBeenCalledWith(mockUsers);
});

test('getAllUsers should return an error when usersService.getAllUsers throws an error', async () => {
  // Mock the usersService.getAllUsers function to throw an error
  usersService.getAllUsers = jest.fn().mockRejectedValue(new Error('Database error'));

  // Make a mock request and response object
  const req = {};
  const res = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis()
  };

  // Call the getAllUsers controller function
  await getAllUsers(req, res);

  // Check if the response contains the error message
  expect(res.status).toHaveBeenCalledWith(500);
  expect(res.json).toHaveBeenCalledWith({ error: 'Server error' });
});

// After all tests are done, restore the original console.error function
afterAll(() => {
  console.error = originalConsoleError;
});
