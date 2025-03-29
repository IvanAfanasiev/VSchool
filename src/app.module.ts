import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { PrismaService } from './prisma.service';
import { JwtStrategy } from './roles/jwt.strategy';
import { AuthModule } from './auth/auth.module';
import { CommentModule } from './comment/comment.module';
import { ChatModule } from './chat/chat.module';
import { MessageModule } from './message/message.module';
import { GatewayModule } from './gateway/gateway.module';
import { constants } from './auth/constants';

@Module({
  imports: [UserModule, PostModule, AuthModule, CommentModule, ChatModule, MessageModule, GatewayModule],
  controllers: [AppController],
  providers: [
    AppService, 
    PrismaService,
    JwtStrategy,
  ],
})
export class AppModule {}
export class PaginationQuery {
  page: number = constants.PAGINATION_BASE_PAGE;
  limit: number = constants.PAGINATION_BASE_LIMIT;
  offset: number = constants.PAGINATION_BASE_OFFSET;
}