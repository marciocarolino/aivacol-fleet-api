/* eslint-disable @typescript-eslint/no-unused-vars */
import { BadRequestException } from '@nestjs/common';

import { GlobalExceptionFilter } from '../../../src/app/shared/filters/global-exception.filter';

describe('GlobalExceptionFilter', () => {
  const response = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  const request = {
    url: '/test',
  };
  const host = {
    switchToHttp: jest.fn(() => ({
      getResponse: jest.fn(() => response),
      getRequest: jest.fn(() => request),
    })),
  };

  let filter: GlobalExceptionFilter;

  beforeEach(() => {
    jest.clearAllMocks();
    filter = new GlobalExceptionFilter();
  });

  // it('should format http exceptions', () => {
  //   filter.catch(new BadRequestException('Invalid data'), host as never);

  //   expect(response.status).toHaveBeenCalledWith(400);
  //   expect(response.json).toHaveBeenCalledWith(
  //     expect.objectContaining({
  //       success: false,
  //       statusCode: 400,
  //       message: 'Invalid data',
  //       path: '/test',
  //     }),
  //   );
  //   expect(response.json.mock.calls[0][0].timestamp).toEqual(
  //     expect.any(String),
  //   );
  // });

  it('should format unknown exceptions as internal server error', () => {
    filter.catch(new Error('Unexpected'), host as never);

    expect(response.status).toHaveBeenCalledWith(500);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        statusCode: 500,
        message: 'Internal server error',
        path: '/test',
      }),
    );
  });
});
