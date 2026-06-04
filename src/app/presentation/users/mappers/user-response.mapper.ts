import { UserEntity } from '../../../domain/users/entities/user.entity';
import { UserResponse } from '../responses/user.response';

export class UserResponseMapper {
  static toResponse(user: UserEntity): UserResponse {
    return {
      id: user.id,
      nickname: user.nickname,
      name: user.name,
      email: user.email,
      createdBy: user.createdBy,
    };
  }
}
