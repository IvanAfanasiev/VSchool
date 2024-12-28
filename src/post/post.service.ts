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

  async findAll(user_id: number) {
    return await this.prisma.post.findMany({
      where:{
        deleted_at: null
      },
      include: {
        _count:{
          select:{
            comments: true,
            likes: true
          }
        },
        author: {
          select:{
            name: true
          }
        },
        comments: {
          // take: 1,
          include:{
            user: {
              select: {
                name: true
              }
            },
            _count:{
              select:{
                likes: true
              }
            }
          },
          orderBy: {
            created_at: 'desc',
          },
        },
      },
      orderBy:{
        created_at: 'desc'
      }
    }).then(async (posts) => {
      // Обрабатываем каждый пост, добавляя `is_liked`
      const enrichedPosts = await Promise.all(
        posts.map(async (post) => {
          const isLiked = await this.prisma.post_like.count({
            where: {
              post_id: post.id,
              evaluator_id: user_id, // Подставьте ID текущего пользователя
            },
          });
    
          return {
            ...post,
            is_liked: isLiked > 0, // true, если лайк найден
          };
        })
      );
      return enrichedPosts;
    });
  }

  async findOne(id: number) {
    const post = await this.prisma.post.findUnique({
      where: {
        id: id
      },
      include: {
        _count:{
          select:{
            comments: true
          }
        },
        comments: {
          take: 1,
          include:{
            _count:{
              select:{
                likes: true
              }
            }
          },
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
