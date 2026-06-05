import { UserEntity } from '../entities/user.entity';

export interface UserRepository {
  save(user: UserEntity): Promise<UserEntity>;

  findById(id: string): Promise<UserEntity | null>;

  findByEmail(email: string): Promise<UserEntity | null>;

  delete(id: string): Promise<void>;
}
