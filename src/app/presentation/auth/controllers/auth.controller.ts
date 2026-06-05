import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';

import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { LoginUseCase } from '../../../application/auth/use-cases/login.use-case';

import { LoginDto } from '../dtos/login.dto';
import { Public } from '../../../modules/auth/decorators/public.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly loginUseCase: LoginUseCase) {}

  @Post('login')
  @Public()
  @Throttle({
    short: {
      limit: 5,
      ttl: 60000,
    },
  })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Authenticate user',
  })
  @ApiResponse({
    status: 200,
    description: 'Authentication successful',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
  })
  async login(@Body() dto: LoginDto) {
    return this.loginUseCase.execute(dto);
  }
}
