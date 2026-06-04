export class UserEntity {
  constructor(
    public readonly id: string,
    public readonly nickname: string,
    public readonly name: string,
    public readonly email: string,
    public readonly password: string,
    public readonly createdBy: string,
  ) {}
}
