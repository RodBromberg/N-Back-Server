const { loginUser } = require('../../../server/controllers/users/usersController');
const usersService = require('../../../server/services/users/usersService');

// Store the original console.error function and replace it with a mock
const originalConsoleError = console.error;
console.error = jest.fn();

test('loginUser should login a user with valid email and password', async () => {
  const email = process.env.EMAIL;
  const password = process.env.PASSWORD;

  const req = {
    body: {
      Email: email,
      Password: password,
    },
  };


  const mockUser = { id: 1, email: 'test@example.com', password: 'password123' };
  usersService.getUserByEmail = jest.fn().mockResolvedValue(mockUser);
  usersService.comparePasswords = jest.fn().mockResolvedValue(true);

  const res = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis()
  };

  await loginUser(req, res);

  expect(res.json).toHaveBeenCalledWith({ message: 'Login successful' });
});

test('loginuser should throw an error if email already exists in database', async ()=>{
  const email = process.env.EMAIL;
  const password = process.env.PASSWORD;
  
  const req = {
    body: {
      Email: email,
      Password: password,
    },
  };
  
})

test('loginUser should return an error when user is not found', async () => {
  const email = process.env.NOT_EXISTING_EMAIL;
  const password = process.env.PASSWORD;

  const req = {
    body: {
      Email: email,
      Password: password,
    },
  };


  usersService.getUserByEmail = jest.fn().mockResolvedValue(null);

  const res = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis()
  };

  await loginUser(req, res);

  expect(res.status).toHaveBeenCalledWith(404);
  expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
});

test('loginUser should return an error when password is incorrect', async () => {
  const email = process.env.EMAIL;
  const password = process.env.INCORRECT_PASSWORD;

  const req = {
    body: {
      Email: email,
      Password: password,
    },
};


  const mockUser = { id: 1, email: 'test@example.com', password: 'password123' };
  usersService.getUserByEmail = jest.fn().mockResolvedValue(mockUser);
  usersService.comparePasswords = jest.fn().mockResolvedValue(false);

  const res = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis()
  };

  await loginUser(req, res);

  expect(res.status).toHaveBeenCalledWith(401);
  expect(res.json).toHaveBeenCalledWith({ error: 'Invalid email or password' });
});

test('loginUser should return an error when usersService.getUserByEmail throws an error', async () => {
  const email = process.env.EMAIL;
  const password = process.env.PASSWORD;

  const req = {
    body: {
      Email: email,
      Password: password,
    },
  };


  usersService.getUserByEmail = jest.fn().mockRejectedValue(new Error('Database error'));

  const res = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis()
  };

  await loginUser(req, res);

  expect(res.status).toHaveBeenCalledWith(500);
  expect(res.json).toHaveBeenCalledWith({ error: 'Server error' });
});



// After all tests are done, restore the original console.error function
afterAll(() => {
  console.error = originalConsoleError;
});
