import { Injectable, NotFoundException, Post } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class PostService {

  constructor(private prisma: PrismaService) {}

  create(dto: CreatePostDto) {
    return this.prisma.post.create({
      data: dto
    });
  }

  async findAll() {
    return await this.prisma.post.findMany({
      where:{
        deleted_at: null
      },
      orderBy:{
        created_at: 'desc'
      }
    });
  }

  async findOne(id: number) {
    const post = await this.prisma.post.findUnique({
      where: {
        id: id
      },
      include: {
        comments: {
          take: 1,
          orderBy: {
            created_at: 'desc',
          },
        },
      }
    });

    if(!post) throw new NotFoundException('post not found');

    return post;
  }

  async update(id: number, dto: UpdatePostDto) {

    await this.findOne(id);

    return await this.prisma.post.update({
      where:{
        id: id
      },
      data: dto
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.post.update({
      where:{
        id: id
      },
      data:{
        deleted_at: new Date()
      }
    });
  }
}
