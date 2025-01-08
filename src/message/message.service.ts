import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class MessageService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateMessageDto) {
    const newMessage = await this.prisma.message.create({
      data: dto
    });

    return await this.findOne(newMessage.id);
  }

  findAll() {
    return `This action returns all message`;
  }

  async findOne(id: number) {
    return await this.prisma.message.findUnique({
      where:{
        id: id
      },
      include:{
        author: true
      }
    });
  }

  async findByChatId(chatId: number) {
    return this.prisma.message.findFirst({
      where:{
        chat_id: chatId,
        deleted_at: null
      },
      take:10,
      include: {
        author:{
          select:{
            name: true
          }
        }
      },
      orderBy:{
        created_at: 'desc'
      },
      
    });
  }

  update(id: number, updateMessageDto: UpdateMessageDto) {
    return `This action updates a #${id} message`;
  }

  remove(id: number) {
    return `This action removes a #${id} message`;
  }
}
