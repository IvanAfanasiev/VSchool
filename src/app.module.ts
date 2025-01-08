import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { PrismaService } from './prisma.service';
import { RolesGuard } from './roles/roles.guard';
import { APP_GUARD } from '@nestjs/core';
import { JwtStrategy } from './roles/jwt.strategy';
import { AuthModule } from './auth/auth.module';
import { CommentModule } from './comment/comment.module';
import { ChatModule } from './chat/chat.module';
import { GatewayChat } from './gateway/gateway.chat';
import { MessageModule } from './message/message.module';

@Module({
  imports: [UserModule, PostModule, AuthModule, CommentModule, ChatModule, GatewayChat, MessageModule],
  controllers: [AppController],
  providers: [
    AppService, 
    PrismaService,
    JwtStrategy
  ],
})
export class AppModule {}
