import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  Put,
} from '@nestjs/common';
import { Request } from 'express';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { CreateModelUseCase } from '../../../application/models/use-cases/create-model.use-case';
import { GetModelByIdUseCase } from '../../../application/models/use-cases/get-model-by-id.use-case';
import { UpdateModelUseCase } from '../../../application/models/use-cases/update-model.use-case';
import { DeleteModelUseCase } from '../../../application/models/use-cases/delete-model.use-case';

import { CreateModelDto } from '../dtos/create-model.dto';
import { UpdateModelDto } from '../dtos/update-model.dto';

import { ModelResponseMapper } from '../mappers/model-response.mapper';

type AuthenticatedRequest = Request & {
  user: {
    userId: string;
    email: string;
  };
};

@ApiBearerAuth()
@ApiTags('Models')
@Controller('models')
export class ModelsController {
  constructor(
    private readonly createModelUseCase: CreateModelUseCase,
    private readonly getModelByIdUseCase: GetModelByIdUseCase,
    private readonly updateModelUseCase: UpdateModelUseCase,
    private readonly deleteModelUseCase: DeleteModelUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new model',
  })
  @ApiResponse({
    status: 201,
    description: 'Model created successfully',
  })
  @ApiResponse({
    status: 409,
    description: 'Model already exists',
  })
  async create(
    @Body() dto: CreateModelDto,
    @Req() request: AuthenticatedRequest,
  ) {
    const model = await this.createModelUseCase.execute({
      name: dto.name,
      brandId: dto.brandId,
      createdBy: request.user.email,
    });

    return ModelResponseMapper.toResponse(model);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get model by id',
  })
  @ApiParam({
    name: 'id',
    description: 'Model id',
  })
  @ApiResponse({
    status: 200,
    description: 'Model found successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Model not found',
  })
  async findById(@Param('id') id: string) {
    const model = await this.getModelByIdUseCase.execute({
      id,
    });

    return ModelResponseMapper.toResponse(model);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update model',
  })
  @ApiParam({
    name: 'id',
    description: 'Model id',
  })
  @ApiResponse({
    status: 200,
    description: 'Model updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Model not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Model already exists',
  })
  async update(@Param('id') id: string, @Body() dto: UpdateModelDto) {
    const model = await this.updateModelUseCase.execute({
      id,
      name: dto.name,
      brandId: dto.brandId,
    });

    return ModelResponseMapper.toResponse(model);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete model',
  })
  @ApiParam({
    name: 'id',
    description: 'Model id',
  })
  @ApiResponse({
    status: 204,
    description: 'Model deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Model not found',
  })
  async delete(@Param('id') id: string): Promise<void> {
    await this.deleteModelUseCase.execute({
      id,
    });
  }
}
