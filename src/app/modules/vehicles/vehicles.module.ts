import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { VehicleTypeOrmEntity } from './persistence/vehicle.typeorm-entity';

import { TypeOrmVehicleRepository } from './repositories/typeorm-vehicle.repository';

import { ModelsModule } from '../models/models.module';

import { CreateVehicleUseCase } from '../../application/vehicles/use-cases/create-vehicle.use-case';
import { GetVehicleByIdUseCase } from '../../application/vehicles/use-cases/get-vehicle-by-id.use-case';
import { UpdateVehicleUseCase } from '../../application/vehicles/use-cases/update-vehicle.use-case';
import { DeleteVehicleUseCase } from '../../application/vehicles/use-cases/delete-vehicle.use-case';
import { ListVehiclesUseCase } from '../../application/vehicles/use-cases/list-vehicles.use-case';

import { VehiclesController } from '../../presentation/vehicles/controller/vehicles.controller';

const vehicleRepositoryProvider = {
  provide: 'VehicleRepository',
  useExisting: TypeOrmVehicleRepository,
};

@Module({
  imports: [TypeOrmModule.forFeature([VehicleTypeOrmEntity]), ModelsModule],
  controllers: [VehiclesController],
  providers: [
    TypeOrmVehicleRepository,

    CreateVehicleUseCase,
    ListVehiclesUseCase,
    GetVehicleByIdUseCase,
    UpdateVehicleUseCase,
    DeleteVehicleUseCase,

    vehicleRepositoryProvider,
  ],
  exports: [vehicleRepositoryProvider],
})
export class VehiclesModule {}
