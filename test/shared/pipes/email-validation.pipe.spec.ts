import { BadRequestException } from '@nestjs/common';

import { EmailValidationPipe } from '../../../src/app/shared/pipes/email-validation.pipe';

describe('EmailValidationPipe', () => {
  let pipe: EmailValidationPipe;

  beforeEach(() => {
    pipe = new EmailValidationPipe();
  });

  it('should return the email when it is valid', () => {
    expect(pipe.transform('marcio@email.com')).toBe('marcio@email.com');
  });

  it('should throw bad request when email is invalid', () => {
    expect(() => pipe.transform('invalid-email')).toThrow(BadRequestException);
    expect(() => pipe.transform('invalid-email')).toThrow('Invalid email');
  });
});
