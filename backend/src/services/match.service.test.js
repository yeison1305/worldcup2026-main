const matchService = require('./match.service');
const matchRepository = require('../repositories/match.repository');
const { NotFoundError, BadRequestError } = require('../errors/AppError');

jest.mock('../repositories/match.repository');
jest.mock('../repositories/team.repository');

describe('Match Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getById', () => {
    it('should return match when found', async () => {
      const mockMatch = {
        id: 1,
        home_team: { name: 'Argentina', flag_url: 'https://flag.test/ar.svg' },
        away_team: { name: 'Brazil', flag_url: 'https://flag.test/br.svg' },
        status: 'SCHEDULED',
      };
      matchRepository.findById.mockResolvedValue(mockMatch);

      const result = await matchService.getById(1);
      expect(result).toEqual(mockMatch);
    });

    it('should throw NotFoundError when match not found', async () => {
      matchRepository.findById.mockResolvedValue(null);

      await expect(matchService.getById(999)).rejects.toThrow(NotFoundError);
    });
  });

  describe('getByGroup', () => {
    it('should accept valid groups A-L', async () => {
      matchRepository.findByGroup.mockResolvedValue([]);

      const result = await matchService.getByGroup('K');
      expect(result).toEqual([]);
      expect(matchRepository.findByGroup).toHaveBeenCalledWith('K');
    });

    it('should reject invalid group M', async () => {
      await expect(matchService.getByGroup('M')).rejects.toThrow(BadRequestError);
    });
  });

  describe('getAll', () => {
    it('should return all matches', async () => {
      const mockMatches = [{ id: 1 }, { id: 2 }];
      matchRepository.findAll.mockResolvedValue(mockMatches);

      const result = await matchService.getAll();
      expect(result).toEqual(mockMatches);
    });
  });
});
