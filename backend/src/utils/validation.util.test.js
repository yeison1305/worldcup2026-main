const { isValidEmail, isValidPassword, isValidName } = require('./validation.util');

describe('Validation Utils', () => {
  describe('isValidEmail', () => {
    it('should accept valid emails', () => {
      expect(isValidEmail('user@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co')).toBe(true);
      expect(isValidEmail('admin@wc2026.com')).toBe(true);
    });

    it('should reject invalid emails', () => {
      expect(isValidEmail('')).toBe(false);
      expect(isValidEmail(null)).toBe(false);
      expect(isValidEmail(undefined)).toBe(false);
      expect(isValidEmail('notanemail')).toBe(false);
      expect(isValidEmail('@domain.com')).toBe(false);
      expect(isValidEmail('user@')).toBe(false);
    });

    it('should trim whitespace', () => {
      expect(isValidEmail('  user@test.com  ')).toBe(true);
    });
  });

  describe('isValidPassword', () => {
    it('should accept passwords with 6+ chars', () => {
      expect(isValidPassword('123456')).toBe(true);
      expect(isValidPassword('admin2026!!')).toBe(true);
    });

    it('should reject passwords under 6 chars', () => {
      expect(isValidPassword('12345')).toBe(false);
      expect(isValidPassword('')).toBeFalsy();
    });
  });

  describe('isValidName', () => {
    it('should accept valid names', () => {
      expect(isValidName('Admin')).toBe(true);
      expect(isValidName('José')).toBe(true);
      expect(isValidName('  Miguel  ')).toBe(true);
    });

    it('should reject invalid names', () => {
      expect(isValidName('')).toBe(false);
      expect(isValidName(null)).toBe(false);
      expect(isValidName('A')).toBe(false);
      expect(isValidName('a'.repeat(101))).toBe(false);
    });
  });
});
