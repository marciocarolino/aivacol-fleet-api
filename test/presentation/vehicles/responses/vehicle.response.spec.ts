import { VehicleResponse } from '../../../../src/app/presentation/vehicles/responses/vehicle.response';

describe('VehicleResponse', () => {
  it('should create response with assigned values', () => {
    const response = new VehicleResponse();

    response.id = 'vehicle-id';
    response.licensePlate = 'ABC1234';
    response.chassis = 'chassis';
    response.renavam = 'renavam';
    response.year = 2024;
    response.modelId = 'model-id';

    expect(response).toEqual({
      id: 'vehicle-id',
      licensePlate: 'ABC1234',
      chassis: 'chassis',
      renavam: 'renavam',
      year: 2024,
      modelId: 'model-id',
    });
  });
});
