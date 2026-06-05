import { CreateVehicleDto } from '../../../../src/app/presentation/vehicles/dtos/create-vehicle.dto';

describe('CreateVehicleDto', () => {
  it('should create dto with assigned values', () => {
    const dto = new CreateVehicleDto();

    dto.licensePlate = 'ABC1234';
    dto.chassis = 'chassis';
    dto.renavam = 'renavam';
    dto.year = 2024;
    dto.modelId = 'model-id';

    expect(dto).toEqual({
      licensePlate: 'ABC1234',
      chassis: 'chassis',
      renavam: 'renavam',
      year: 2024,
      modelId: 'model-id',
    });
  });
});
