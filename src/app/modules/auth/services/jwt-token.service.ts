import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { TokenService } from '../../../domain/auth/services/token.service';

@Injectable()
export class JwtTokenService implements TokenService {
  constructor(private readonly jwtService: JwtService) {}

  async generateAccessToken(payload: object): Promise<string> {
    return this.jwtService.signAsync(payload);
  }
}
