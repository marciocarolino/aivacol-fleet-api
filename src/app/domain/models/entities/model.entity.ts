export class ModelEntity {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly brandId: string,
    public readonly createdBy: string,
  ) {}
}
