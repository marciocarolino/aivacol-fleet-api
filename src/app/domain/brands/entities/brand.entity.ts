export class BrandEntity {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly createdBy: string,
  ) {}
}
