import { UpdateVehicleDto } from '../../../../src/app/presentation/vehicles/dtos/update-vehicle.dto';

describe('UpdateVehicleDto', () => {
  it('should create dto with assigned values', () => {
    const dto = new UpdateVehicleDto();

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
