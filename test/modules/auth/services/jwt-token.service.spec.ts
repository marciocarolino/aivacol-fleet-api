import { JwtTokenService } from '../../../../src/app/modules/auth/services/jwt-token.service';

describe('JwtTokenService', () => {
  it('should generate access token using JwtService', async () => {
    const jwtService = {
      signAsync: jest.fn().mockResolvedValue('jwt-token'),
    };
    const service = new JwtTokenService(jwtService as never);
    const payload = { sub: 'user-id', email: 'marcio@email.com' };

    await expect(service.generateAccessToken(payload)).resolves.toBe(
      'jwt-token',
    );
    expect(jwtService.signAsync).toHaveBeenCalledWith(payload);
  });
});
