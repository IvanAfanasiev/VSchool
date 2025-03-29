import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { PrismaService } from 'src/prisma.service';
import { CommentService } from 'src/comment/comment.service';

@Module({
  controllers: [PostController],
  providers: [PostService, CommentService, PrismaService],
})
export class PostModule {}
