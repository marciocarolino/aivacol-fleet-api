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
  Req,
} from '@nestjs/common';
import { Request } from 'express';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { CreateBrandUseCase } from '../../../application/brands/use-cases/create-brand.use-case';
import { DeleteBrandUseCase } from '../../../application/brands/use-cases/delete-brand.use-case';
import { GetBrandByIdUseCase } from '../../../application/brands/use-cases/get-brand-by-id.use-case';
import { UpdateBrandUseCase } from '../../../application/brands/use-cases/update-brand.use-case';

import { CreateBrandDto } from '../dtos/create-brand.dto';
import { UpdateBrandDto } from '../dtos/update-brand.dto';
import { BrandResponseMapper } from '../mappers/brand-response.mapper';

type AuthenticatedRequest = Request & {
  user: {
    userId: string;
    email: string;
  };
};

@ApiBearerAuth()
@ApiTags('Brands')
@Controller('brands')
export class BrandsController {
  constructor(
    private readonly createBrandUseCase: CreateBrandUseCase,
    private readonly getBrandByIdUseCase: GetBrandByIdUseCase,
    private readonly updateBrandUseCase: UpdateBrandUseCase,
    private readonly deleteBrandUseCase: DeleteBrandUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new brand',
  })
  @ApiResponse({
    status: 201,
    description: 'Brand created successfully',
  })
  @ApiResponse({
    status: 409,
    description: 'Brand already exists',
  })
  async create(
    @Body() dto: CreateBrandDto,
    @Req() request: AuthenticatedRequest,
  ) {
    const brand = await this.createBrandUseCase.execute({
      name: dto.name,
      createdBy: request.user.email,
    });

    return BrandResponseMapper.toResponse(brand);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get brand by id',
  })
  @ApiParam({
    name: 'id',
    description: 'Brand id',
  })
  @ApiResponse({
    status: 200,
    description: 'Brand found successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Brand not found',
  })
  async findById(@Param('id') id: string) {
    const brand = await this.getBrandByIdUseCase.execute({
      id,
    });

    return BrandResponseMapper.toResponse(brand);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update brand',
  })
  @ApiParam({
    name: 'id',
    description: 'Brand id',
  })
  @ApiResponse({
    status: 200,
    description: 'Brand updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Brand not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Brand already exists',
  })
  async update(@Param('id') id: string, @Body() dto: UpdateBrandDto) {
    const brand = await this.updateBrandUseCase.execute({
      id,
      name: dto.name,
    });

    return BrandResponseMapper.toResponse(brand);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete brand',
  })
  @ApiParam({
    name: 'id',
    description: 'Brand id',
  })
  @ApiResponse({
    status: 204,
    description: 'Brand deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Brand not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Brand is in use',
  })
  async delete(@Param('id') id: string): Promise<void> {
    await this.deleteBrandUseCase.execute({
      id,
    });
  }
}
