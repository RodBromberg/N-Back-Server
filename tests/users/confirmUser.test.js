const { confirmUser } = require('../../server/controllers/users/usersController')
// will fail
test('confirmUser should confirm a user', async () => {
    // Mock the request object
    const req = {
      query: {
        // token: ENV
      }
    };
  
    // Make a mock response object
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };
  
    // Call the confirmUser controller function
    await confirmUser(req, res);
  
    // Check if the response contains the success message
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'User confirmed successfully.' });
  });
  
  test('confirmUser should return an error when usersService.confirmUser throws an error', async () => {
    // Mock the request object
    const req = {
      query: {
        token: 'token123'
      }
    };
  
    // Mock the usersService.confirmUser function to throw an error
    usersService.confirmUser = jest.fn().mockRejectedValue(new Error('Database error'));
  
    // Make a mock response object
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };
  
    // Call the confirmUser controller function
    await confirmUser(req, res);
  
    // Check if the response contains the error message
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Server error' });
  });
  
  