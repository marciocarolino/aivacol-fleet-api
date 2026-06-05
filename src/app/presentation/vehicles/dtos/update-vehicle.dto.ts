import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsUUID, MaxLength } from 'class-validator';

export class UpdateVehicleDto {
  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(20)
  licensePlate: string;

  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(255)
  chassis: string;

  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(255)
  renavam: string;

  @ApiProperty()
  @IsNumber()
  year: number;

  @ApiProperty()
  @IsUUID()
  modelId: string;
}
