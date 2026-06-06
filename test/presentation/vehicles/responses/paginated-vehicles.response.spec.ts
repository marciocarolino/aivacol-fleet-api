import { PaginatedVehiclesResponse } from '../../../../src/app/presentation/vehicles/responses/paginated-vehicles.response';

describe('PaginatedVehiclesResponse', () => {
  it('should create response with assigned values', () => {
    const response = new PaginatedVehiclesResponse();

    response.items = [];
    response.total = 0;
    response.page = 1;
    response.limit = 10;

    expect(response).toEqual({
      items: [],
      total: 0,
      page: 1,
      limit: 10,
    });
  });
});
