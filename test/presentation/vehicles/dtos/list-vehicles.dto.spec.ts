import { ListVehiclesDto } from '../../../../src/app/presentation/vehicles/dtos/list-vehicles.dto';
import { plainToInstance } from 'class-transformer';

describe('ListVehiclesDto', () => {
  it('should create dto with assigned values', () => {
    const dto = new ListVehiclesDto();

    dto.page = 2;
    dto.limit = 5;
    dto.licensePlate = 'ABC';
    dto.chassis = 'chassis';
    dto.renavam = 'renavam';
    dto.year = 2024;
    dto.modelId = 'd3684ea3-8dbf-42d9-8e60-236e642ffcb5';

    expect(dto).toEqual({
      page: 2,
      limit: 5,
      licensePlate: 'ABC',
      chassis: 'chassis',
      renavam: 'renavam',
      year: 2024,
      modelId: 'd3684ea3-8dbf-42d9-8e60-236e642ffcb5',
    });
  });

  it('should transform numeric query fields', () => {
    const dto = plainToInstance(ListVehiclesDto, {
      page: '2',
      limit: '5',
      year: '2024',
    });

    expect(dto.page).toBe(2);
    expect(dto.limit).toBe(5);
    expect(dto.year).toBe(2024);
  });
});
