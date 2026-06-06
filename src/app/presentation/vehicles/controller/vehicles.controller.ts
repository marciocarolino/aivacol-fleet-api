import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
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

import { CreateVehicleUseCase } from '../../../application/vehicles/use-cases/create-vehicle.use-case';
import { GetVehicleByIdUseCase } from '../../../application/vehicles/use-cases/get-vehicle-by-id.use-case';
import { UpdateVehicleUseCase } from '../../../application/vehicles/use-cases/update-vehicle.use-case';
import { DeleteVehicleUseCase } from '../../../application/vehicles/use-cases/delete-vehicle.use-case';
import { ListVehiclesUseCase } from '../../../application/vehicles/use-cases/list-vehicles.use-case';

import { CreateVehicleDto } from '../dtos/create-vehicle.dto';
import { UpdateVehicleDto } from '../dtos/update-vehicle.dto';
import { ListVehiclesDto } from '../dtos/list-vehicles.dto';

import { VehicleResponseMapper } from '../mappers/vehicle-response.mapper';

type AuthenticatedRequest = Request & {
  user: {
    userId: string;
    email: string;
  };
};

@ApiBearerAuth()
@ApiTags('Vehicles')
@Controller('vehicles')
export class VehiclesController {
  constructor(
    private readonly createVehicleUseCase: CreateVehicleUseCase,
    private readonly listVehiclesUseCase: ListVehiclesUseCase,
    private readonly getVehicleByIdUseCase: GetVehicleByIdUseCase,
    private readonly updateVehicleUseCase: UpdateVehicleUseCase,
    private readonly deleteVehicleUseCase: DeleteVehicleUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new vehicle',
  })
  @ApiResponse({
    status: 201,
    description: 'Vehicle created successfully',
  })
  @ApiResponse({
    status: 409,
    description: 'Vehicle already exists',
  })
  async create(
    @Body() dto: CreateVehicleDto,
    @Req() request: AuthenticatedRequest,
  ) {
    const vehicle = await this.createVehicleUseCase.execute({
      ...dto,
      createdBy: request.user.email,
    });

    return VehicleResponseMapper.toResponse(vehicle);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'List vehicles with pagination and filters',
  })
  @ApiResponse({
    status: 200,
    description: 'Vehicles listed successfully',
  })
  async findAll(@Query() query: ListVehiclesDto) {
    const result = await this.listVehiclesUseCase.execute(query);

    return VehicleResponseMapper.toPaginatedResponse(result);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get vehicle by id',
  })
  @ApiParam({
    name: 'id',
    description: 'Vehicle id',
  })
  @ApiResponse({
    status: 200,
    description: 'Vehicle found successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Vehicle not found',
  })
  async findById(@Param('id') id: string) {
    const vehicle = await this.getVehicleByIdUseCase.execute({
      id,
    });

    return VehicleResponseMapper.toResponse(vehicle);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update vehicle',
  })
  @ApiParam({
    name: 'id',
    description: 'Vehicle id',
  })
  @ApiResponse({
    status: 200,
    description: 'Vehicle updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Vehicle not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Vehicle already exists',
  })
  async update(@Param('id') id: string, @Body() dto: UpdateVehicleDto) {
    const vehicle = await this.updateVehicleUseCase.execute({
      id,
      ...dto,
    });

    return VehicleResponseMapper.toResponse(vehicle);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete vehicle',
  })
  @ApiParam({
    name: 'id',
    description: 'Vehicle id',
  })
  @ApiResponse({
    status: 204,
    description: 'Vehicle deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Vehicle not found',
  })
  async delete(@Param('id') id: string): Promise<void> {
    await this.deleteVehicleUseCase.execute({
      id,
    });
  }
}
