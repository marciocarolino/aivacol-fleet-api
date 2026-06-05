import { ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { JwtAuthGuard } from '../../../../src/app/modules/auth/guards/jwt-auth.guard';
import { IS_PUBLIC_KEY } from '../../../../src/app/modules/auth/decorators/public.decorator';

jest.mock('@nestjs/passport', () => ({
  AuthGuard: jest.fn(() => {
    class MockAuthGuard {
      canActivate() {
        return 'passport-result';
      }
    }

    return MockAuthGuard;
  }),
}));

describe('JwtAuthGuard', () => {
  const context = {
    getHandler: jest.fn(() => 'handler'),
    getClass: jest.fn(() => 'class'),
  } as unknown as ExecutionContext;

  it('should return true when route is public', () => {
    const reflector = {
      getAllAndOverride: jest.fn(() => true),
    };
    const guard = new JwtAuthGuard(reflector as never);

    expect(guard.canActivate(context)).toBe(true);
    expect(reflector.getAllAndOverride).toHaveBeenCalledWith(IS_PUBLIC_KEY, [
      'handler',
      'class',
    ]);
  });

  it('should delegate to passport auth guard when route is not public', () => {
    const reflector = {
      getAllAndOverride: jest.fn(() => false),
    };
    const guard = new JwtAuthGuard(reflector as never);

    expect(guard.canActivate(context)).toBe('passport-result');
    expect(AuthGuard).toHaveBeenCalledWith('jwt');
  });
});
