import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { PrismaService } from 'src/prisma.service';
import { MessageService } from 'src/message/message.service';

@Module({
  controllers: [ChatController],
  providers: [ChatService, PrismaService, MessageService],
})
export class ChatModule {}
