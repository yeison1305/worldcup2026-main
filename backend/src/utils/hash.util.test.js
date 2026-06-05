const { hashPassword, comparePassword } = require('./hash.util');

describe('Hash Utils', () => {
  it('should hash a password', async () => {
    const hash = await hashPassword('admin2026!!');
    expect(hash).toBeDefined();
    expect(typeof hash).toBe('string');
    expect(hash.startsWith('$2b$') || hash.startsWith('$2a$')).toBe(true);
  });

  it('should verify correct password', async () => {
    const hash = await hashPassword('test1234');
    const match = await comparePassword('test1234', hash);
    expect(match).toBe(true);
  });

  it('should reject wrong password', async () => {
    const hash = await hashPassword('test1234');
    const match = await comparePassword('wrongpass', hash);
    expect(match).toBe(false);
  });

  it('should produce different hashes for same password', async () => {
    const hash1 = await hashPassword('samepass');
    const hash2 = await hashPassword('samepass');
    expect(hash1).not.toBe(hash2);
  });
});
