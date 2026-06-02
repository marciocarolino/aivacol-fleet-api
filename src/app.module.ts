import { Module } from '@nestjs/common';
import { UsersModule } from './app/modules/users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
