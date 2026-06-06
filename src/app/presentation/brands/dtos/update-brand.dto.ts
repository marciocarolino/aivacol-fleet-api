import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength } from 'class-validator';

export class UpdateBrandDto {
  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;
}
