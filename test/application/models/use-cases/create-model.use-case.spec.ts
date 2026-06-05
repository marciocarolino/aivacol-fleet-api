import { HttpStatus } from '@nestjs/common';

import { CreateModelUseCase } from '../../../../src/app/application/models/use-cases/create-model.use-case';
import { ModelEntity } from '../../../../src/app/domain/models/entities/model.entity';

jest.mock('crypto', () => ({
  randomUUID: jest.fn(() => 'generated-model-id'),
}));

describe('CreateModelUseCase', () => {
  const modelRepository = {
    save: jest.fn(),
    findById: jest.fn(),
    findByName: jest.fn(),
    delete: jest.fn(),
  };

  const input = {
    name: 'Sprinter',
    createdBy: 'system',
  };

  let useCase: CreateModelUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new CreateModelUseCase(modelRepository);
  });

  it('should create a model when name does not exist', async () => {
    const savedModel = new ModelEntity(
      'generated-model-id',
      input.name,
      input.createdBy,
    );

    modelRepository.findByName.mockResolvedValue(null);
    modelRepository.save.mockResolvedValue(savedModel);

    await expect(useCase.execute(input)).resolves.toBe(savedModel);

    expect(modelRepository.findByName).toHaveBeenCalledWith(input.name);
    expect(modelRepository.save).toHaveBeenCalledWith(savedModel);
  });

  it('should throw conflict when model name already exists', async () => {
    modelRepository.findByName.mockResolvedValue(
      new ModelEntity('existing-id', input.name, input.createdBy),
    );

    await expect(useCase.execute(input)).rejects.toMatchObject({
      response: {
        success: false,
        message: 'Model already exists',
        statusCode: HttpStatus.CONFLICT,
      },
    });

    expect(modelRepository.save).not.toHaveBeenCalled();
  });
});
