// *** Will fail until functions enables and changed upon AWS approval

const { confirmUser } = require('../../../controllers/users/usersController');
const usersService = require('../../../services/users/usersService');

// Store the original console.error function and replace it with a mock
const originalConsoleError = console.error;
console.error = jest.fn();

test('confirmUser should confirm a user', async () => {
  const req = {
    query: {
      token: 'token123'
    }
  };

  const res = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis()
  };

  // Mock the usersService.confirmUser function
  usersService.confirmUser = jest.fn();

  await confirmUser(req, res);

  expect(usersService.confirmUser).toHaveBeenCalledWith('token123');
  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith({ message: 'User confirmed successfully.' });
});

test('confirmUser should return an error when usersService.confirmUser throws an error', async () => {
  const req = {
    query: {
      token: 'token123'
    }
  };

  const res = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis()
  };

  // Mock the usersService.confirmUser function to throw an error
  usersService.confirmUser = jest.fn().mockRejectedValue(new Error('Database error'));

  await confirmUser(req, res);

  expect(res.status).toHaveBeenCalledWith(500);
  expect(res.json).toHaveBeenCalledWith({ error: 'Server error' });
});

// After all tests are done, restore the original console.error function
afterAll(() => {
  console.error = originalConsoleError;
});
