import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { PrismaService } from 'src/prisma.service';
import { contains } from 'class-validator';
import { MessageService } from '../message/message.service';

@Injectable()
export class ChatService {

  constructor(
    private prisma: PrismaService,
    private messageService: MessageService
  ) {}
  

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
          select:{
            text: true,
            created_at: true,
            author: {
              select:{
                name: true,
                role: true,
              }
            }
          },
          take:1,
          orderBy:{
            created_at: 'desc'
          },
        }
      }
    });
  }

  async getMessages(chat_id: number, userId: number){
    const chat = await this.prisma.chat.findUnique({
      where:{
        id: chat_id,
        users:{
          some: {
            id: userId
          }
        }
      },
      select:{
        title: true,
        // messages: {
        //   where:{
        //     deleted_at: null
        //   },
        //   take:10,
        //   orderBy:{
        //     created_at: 'desc'
        //   },
        //   include: {
        //     author:{
        //       select:{
        //         name: true
        //       }
        //     }
        //   }
        // }
      },
    });

    if (!chat) {
      throw new ForbiddenException('You do not have access to this chat');
    
    }
    chat['messages'] = await this.messageService.findByChatId(chat_id);
    return chat;

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
