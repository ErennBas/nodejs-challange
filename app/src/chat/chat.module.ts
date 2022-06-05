import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatEntity } from './entities/chat.entity';

@Module({
  providers: [ChatGateway, ChatService],
  imports: [AuthModule, UsersModule, TypeOrmModule.forFeature([ChatEntity])],
})
export class ChatModule {}
