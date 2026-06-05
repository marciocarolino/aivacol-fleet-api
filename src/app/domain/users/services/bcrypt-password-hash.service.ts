import { Injectable } from '@nestjs/common';
import { compare, hash } from 'bcryptjs';

import { PasswordHashService } from '../../../domain/users/services/password-hash.service';

@Injectable()
export class BcryptPasswordHashService implements PasswordHashService {
  async hash(password: string): Promise<string> {
    return hash(password, 10);
  }

  async compare(password: string, hashPassword: string): Promise<boolean> {
    return compare(password, hashPassword);
  }
}
