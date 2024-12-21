import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class CommentService {

  constructor(private prisma: PrismaService) {}

  async findOne(id: number) {
    const post = await this.prisma.comment.findUnique({
      where: {
        id: id
      }
    });

    if(!post) throw new NotFoundException('comment not found');

    return post;
  }

  create(dto: CreateCommentDto) {
    return this.prisma.comment.create({
      data: dto
    });
  }

  findAllByPostId(id: number) {
    return this.prisma.comment.findMany({
      where:{
        post_id: id,
      },
      orderBy:{
        created_at: 'desc'
      }
    })
  }

  findOneByPostId(id: number) {
    return this.prisma.comment.findFirst({
      where:{
        post_id: id,
      },
      orderBy:{
        created_at: 'desc'
      }
    })
  }

  async update(id: number, dto: UpdateCommentDto) {
    const comment = this.findOne(id);

    return await this.prisma.post.update({
      where:{
        id: id
      },
      data: dto
    });
  }

  async remove(id: number) {
    const comment = this.findOne(id);

    return await this.prisma.post.update({
      where:{
        id: id
      },
      data:{
        deleted_at: new Date()
      }
    });
  }
}
