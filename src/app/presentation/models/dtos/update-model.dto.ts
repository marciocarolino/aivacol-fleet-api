import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID, MaxLength } from 'class-validator';

export class UpdateModelDto {
  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  brandId: string;
}
