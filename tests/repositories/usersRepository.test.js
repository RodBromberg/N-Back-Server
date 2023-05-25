const usersRepository = require('../../server/repositories/users/usersRepository');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');

jest.mock('@aws-sdk/client-dynamodb');

describe('usersRepository', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      const mockUsers = [{ id: 1 }, { id: 2 }];
      DynamoDBClient.prototype.send.mockResolvedValue({ Items: mockUsers });

      const users = await usersRepository.getAllUsers();

      expect(users).toEqual(mockUsers);
    });

    // Additional tests for error handling, etc.
  });

  // Similar tests for other repository functions...
});
