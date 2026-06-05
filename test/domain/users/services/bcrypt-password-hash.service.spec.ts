import { compare, hash } from 'bcryptjs';

import { BcryptPasswordHashService } from '../../../../src/app/domain/users/services/bcrypt-password-hash.service';

jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('BcryptPasswordHashService', () => {
  let service: BcryptPasswordHashService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new BcryptPasswordHashService();
  });

  it('should hash password using bcrypt', async () => {
    jest.mocked(hash).mockResolvedValue('hashed-password' as never);

    await expect(service.hash('123456')).resolves.toBe('hashed-password');
    expect(hash).toHaveBeenCalledWith('123456', 10);
  });

  it('should compare password using bcrypt', async () => {
    jest.mocked(compare).mockResolvedValue(true as never);

    await expect(service.compare('123456', 'hashed-password')).resolves.toBe(
      true,
    );
    expect(compare).toHaveBeenCalledWith('123456', 'hashed-password');
  });
});
