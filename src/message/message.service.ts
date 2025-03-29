import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { PrismaService } from 'src/prisma.service';
import { AnonymousSubject } from 'rxjs/internal/Subject';

@Injectable()
export class MessageService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateMessageDto) {
    const newMessage = await this.prisma.message.create({
      data: {
        author_id: dto.author_id,
        chat_id: dto.chat_id,
        text: dto.text,
        answer: dto.answer,
        updated_at: null,
      },
    });

    return await this.findOne(newMessage.id);
  }

  findAll() {
    return `This action returns all message`;
  }

  async findOne(id: number) {
    const message = await this.prisma.message
      .findUnique({
        where: {
          id: id,
        },
        include: {
          author: {
            select: {
              name: true,
              role: true,
            },
          },
        },
      })
      .then(async (message) => {
        if (message.answer) {
          const replyTo = await this.prisma.message.findUnique({
            where: {
              id: message.answer,
            },
            include: {
              author: {
                select: {
                  name: true,
                },
              },
            },
          });
          return {
            ...message,
            reply: replyTo,
          };
        }
        return message;
      });
    return message;
  }

  async findByChatId(chatId: number) {
    const messages = await this.prisma.message
      .findMany({
        where: {
          chat_id: chatId,
        },
        skip: 0,
        take: 50,
        include: {
          author: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          created_at: 'desc',
        },
      })
      .then(async (messages) => {
        const enrichedMessages = await Promise.all(
          messages.map(async (message) => {
            if (message.answer) {
              const replyTo = await this.prisma.message.findUnique({
                where: {
                  id: message.answer,
                },
                include: {
                  author: {
                    select: {
                      name: true,
                    },
                  },
                },
              });
              return {
                ...message,
                reply: replyTo,
              };
            } else {
            }
            return message;
          }),
        );

        return enrichedMessages;
      });
    return messages;
  }

  update(id: number, updateMessageDto: UpdateMessageDto) {
    return `This action updates a #${id} message`;
  }

  async remove(id: number) {
    const message = this.findOne(id);

    return await this.prisma.message.update({
      where: {
        id: id,
      },
      data: {
        deleted_at: new Date(),
      },
    });
  }
}
