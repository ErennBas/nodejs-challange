/* eslint-disable */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { MongoRepository } from 'typeorm';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { ChatEntity } from './entities/chat.entity';
import { ChatMessage } from './entities/chat.model';

@Injectable()
export class ChatService {
  constructor(@InjectRepository(ChatEntity) private readonly chatRepos: MongoRepository <ChatEntity>) {
    
  }

  async create(chat: ChatMessage): Promise<ChatMessage> {
    return await this.chatRepos.save(this.chatRepos.create(chat));
  }

  async getMessages(pageOptions: IPaginationOptions): Promise<Pagination<ChatMessage>>{
    const messages = this.chatRepos.createQueryBuilder('message');
    return paginate(messages, pageOptions)
  }

  findOne(id: number) {
    return `This action returns a #${id} chat`;
  }

  update(id: number, updateChatDto: UpdateChatDto) {
    return `This action updates a #${id} chat`;
  }

  remove(id: number) {
    return `This action removes a #${id} chat`;
  }
}
