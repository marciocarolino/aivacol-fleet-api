import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';

import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CreateUserUseCase } from '../../../application/users/use-cases/create-user.use-case';
import { GetUserByIdUseCase } from '../../../application/users/use-cases/get-user-by-id.use-case';
import { GetUserByEmailUseCase } from '../../../application/users/use-cases/get-user-by-email.use-case';
import { DeleteUserUseCase } from '../../../application/users/use-cases/delete-user.use-case';
import { UpdateUserUseCase } from '../../../application/users/use-cases/update-user.use-case';

import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';

import { UserResponseMapper } from '../mappers/user-response.mapper';
import { EmailValidationPipe } from '../../../shared/pipes/email-validation.pipe';
import { Public } from '../../../modules/auth/decorators/public.decorator';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
    private readonly getUserByEmailUseCase: GetUserByEmailUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
  ) {}

  @Post()
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new user',
  })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
  })
  @ApiResponse({
    status: 409,
    description: 'User already exists',
  })
  async create(@Body() dto: CreateUserDto) {
    const user = await this.createUserUseCase.execute(dto);

    return UserResponseMapper.toResponse(user);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get user by id',
  })
  @ApiParam({
    name: 'id',
    description: 'User id',
  })
  @ApiResponse({
    status: 200,
    description: 'User found successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async findById(@Param('id') id: string) {
    const user = await this.getUserByIdUseCase.execute({
      id,
    });

    return UserResponseMapper.toResponse(user);
  }

  @Get('email/:email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get user by email',
  })
  @ApiParam({
    name: 'email',
    description: 'User email',
  })
  @ApiResponse({
    status: 200,
    description: 'User found successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async findByEmail(@Param('email', EmailValidationPipe) email: string) {
    const user = await this.getUserByEmailUseCase.execute({
      email,
    });

    return UserResponseMapper.toResponse(user);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete user by id',
  })
  @ApiParam({
    name: 'id',
    description: 'User id',
  })
  @ApiResponse({
    status: 204,
    description: 'User deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async delete(@Param('id') id: string): Promise<void> {
    await this.deleteUserUseCase.execute({
      id,
    });
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update user',
  })
  @ApiParam({
    name: 'id',
    description: 'User id',
  })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiResponse({
    status: 409,
    description: 'User already exists',
  })
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    const user = await this.updateUserUseCase.execute({
      id,
      ...dto,
    });

    return UserResponseMapper.toResponse(user);
  }
}
