import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'Aivacol',
    description: 'User NickName',
  })
  @MinLength(3)
  @IsString()
  nickname: string;

  @ApiProperty({
    example: ' Aivacol Administrator',
    description: 'User full name',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'admin@aivacol.com',
    description: 'User email address',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '123456',
    description: 'User password',
  })
  @IsString()
  @MinLength(6)
  password: string;
}
