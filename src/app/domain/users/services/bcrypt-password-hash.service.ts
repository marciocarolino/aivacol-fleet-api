import { Injectable } from '@nestjs/common';
import { hash } from 'bcryptjs';

import { PasswordHashService } from '../../../domain/users/services/password-hash.service';

@Injectable()
export class BcryptPasswordHashService implements PasswordHashService {
  async hash(password: string): Promise<string> {
    return hash(password, 10);
  }
}
