import { Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ChatService {

  constructor(private prisma: PrismaService) {}
  

  create(dto: CreateChatDto) {
    return 'This action adds a new chat';
  }

  async findAll(user_id: number) {
    return await this.prisma.chat.findMany({
      where: {
        users: {
          some: {
            id: user_id,
          },
        },
      },
      include:{
        messages:{
          take:1,
          orderBy:{
            created_at: 'desc'
          }
        }
      }
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} chat`;
  }

  update(id: number, dto: UpdateChatDto) {
    return `This action updates a #${id} chat`;
  }

  async addUser(chat_id: number, users_id: number[]) {
    return await Promise.all(
      users_id.map((user_id) =>this.prisma.chat.update({
      where: {
        id: chat_id,
      },
      data: {
        users: {
          connect: {
            id: user_id,
          },
        },
      },
    })));
      
  }

  remove(id: number) {
    return `This action removes a #${id} chat`;
  }
}
