import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength } from 'class-validator';

export class CreateModelDto {
  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;
}
