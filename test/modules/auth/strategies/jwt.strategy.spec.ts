import { JwtStrategy } from '../../../../src/app/modules/auth/strategies/jwt.strategy';

describe('JwtStrategy', () => {
  const originalJwtSecret = process.env.JWT_SECRET;

  beforeEach(() => {
    process.env.JWT_SECRET = 'test-secret';
  });

  afterAll(() => {
    process.env.JWT_SECRET = originalJwtSecret;
  });

  it('should validate jwt payload', () => {
    const strategy = new JwtStrategy();

    expect(
      strategy.validate({ sub: 'user-id', email: 'marcio@email.com' }),
    ).toEqual({
      userId: 'user-id',
      email: 'marcio@email.com',
    });
  });
});
