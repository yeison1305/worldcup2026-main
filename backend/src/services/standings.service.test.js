const standingsService = require('./standings.service');
const standingsRepository = require('../repositories/standings.repository');
const { BadRequestError } = require('../errors/AppError');

jest.mock('../repositories/standings.repository');

describe('Standings Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getByGroup', () => {
    it('should accept valid groups A-L', async () => {
      standingsRepository.calculateByGroup.mockResolvedValue([
        { teamName: 'Argentina', points: 9 },
        { teamName: 'Brazil', points: 6 },
      ]);

      const result = await standingsService.getByGroup('J');
      expect(result.group).toBe('J');
      expect(result.standings.length).toBe(2);
    });

    it('should reject invalid group Z', async () => {
      await expect(standingsService.getByGroup('Z')).rejects.toThrow(BadRequestError);
    });

    it('should normalize lowercase to uppercase', async () => {
      standingsRepository.calculateByGroup.mockResolvedValue([]);

      await standingsService.getByGroup('a');
      expect(standingsRepository.calculateByGroup).toHaveBeenCalledWith('A');
    });
  });

  describe('getAll', () => {
    it('should return all groups with standings', async () => {
      standingsRepository.calculateByGroup.mockResolvedValue([
        { teamName: 'Team', points: 0 },
      ]);

      const result = await standingsService.getAll();
      const keys = Object.keys(result);
      expect(keys.length).toBe(12);
    });
  });
});
