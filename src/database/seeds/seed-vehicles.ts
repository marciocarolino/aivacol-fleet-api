import 'dotenv/config';
import { randomUUID } from 'crypto';
import { readFileSync } from 'fs';
import { resolve } from 'path';

import AppDataSource from '../../config/data-source';
import { BrandTypeOrmEntity } from '../../app/modules/brands/persistence/brand.typeorm-entity';
import { ModelTypeOrmEntity } from '../../app/modules/models/persistence/model.typeorm-entity';
import { VehicleTypeOrmEntity } from '../../app/modules/vehicles/persistence/vehicle.typeorm-entity';

type SeedVehicle = {
  licensePlate: string;
  chassis: string;
  renavam: string;
  year: number;
  brand: {
    name: string;
  };
  model: {
    name: string;
  };
};

async function seedVehicles(): Promise<void> {
  const seedPath = resolve(process.cwd(), 'seed_vehicles.json');
  const seedFile = readFileSync(seedPath, 'utf8');
  const vehicles = JSON.parse(seedFile) as SeedVehicle[];

  const dataSource = await AppDataSource.initialize();
  const brandRepository = dataSource.getRepository(BrandTypeOrmEntity);
  const modelRepository = dataSource.getRepository(ModelTypeOrmEntity);
  const vehicleRepository = dataSource.getRepository(VehicleTypeOrmEntity);

  try {
    for (const seedVehicle of vehicles) {
      let brand = await brandRepository.findOne({
        where: { name: seedVehicle.brand.name },
      });

      if (!brand) {
        brand = brandRepository.create({
          id: randomUUID(),
          name: seedVehicle.brand.name,
          createdBy: 'seed',
        });

        await brandRepository.save(brand);
      }

      let model = await modelRepository.findOne({
        where: { name: seedVehicle.model.name },
      });

      if (!model) {
        model = modelRepository.create({
          id: randomUUID(),
          name: seedVehicle.model.name,
          brandId: brand.id,
          createdBy: 'seed',
        });

        await modelRepository.save(model);
      }

      const vehicleAlreadyExists = await vehicleRepository.findOne({
        where: { licensePlate: seedVehicle.licensePlate },
      });

      if (vehicleAlreadyExists) {
        continue;
      }

      const vehicle = vehicleRepository.create({
        id: randomUUID(),
        licensePlate: seedVehicle.licensePlate,
        chassis: seedVehicle.chassis,
        renavam: seedVehicle.renavam,
        year: seedVehicle.year,
        modelId: model.id,
        createdBy: 'seed',
      });

      await vehicleRepository.save(vehicle);
    }
  } finally {
    await dataSource.destroy();
  }
}

void seedVehicles();
