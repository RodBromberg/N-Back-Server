const usersController = require('../../controllers/usersController');
const usersService = require('../../../server/services/users/usersService');

jest.mock('../../services/usersService');

describe('usersController', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      const mockUsers = [{ id: 1 }, { id: 2 }];
      usersService.getAllUsers.mockResolvedValue(mockUsers);

      const mockReq = {};
      const mockRes = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await usersController.getAllUsers(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith(mockUsers);
    });
  });
});
