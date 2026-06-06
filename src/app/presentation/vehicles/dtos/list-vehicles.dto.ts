import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';

export class ListVehiclesDto {
  @ApiPropertyOptional({
    example: 1,
  })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({
    example: 10,
  })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;

  @ApiPropertyOptional({
    example: 'ABC1234',
  })
  @IsOptional()
  @IsString()
  licensePlate?: string;

  @ApiPropertyOptional({
    example: '9BWZZZ377VT004251',
  })
  @IsOptional()
  @IsString()
  chassis?: string;

  @ApiPropertyOptional({
    example: '12345678901',
  })
  @IsOptional()
  @IsString()
  renavam?: string;

  @ApiPropertyOptional({
    example: 2024,
  })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  year?: number;

  @ApiPropertyOptional({
    example: 'd3684ea3-8dbf-42d9-8e60-236e642ffcb5',
  })
  @IsOptional()
  @IsUUID()
  modelId?: string;
}
