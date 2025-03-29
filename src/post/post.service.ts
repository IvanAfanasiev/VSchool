import { Injectable, NotFoundException, Post } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from 'src/prisma.service';
import { LikeDto } from './dto/like.dto';
import { CommentService } from 'src/comment/comment.service';

@Injectable()
export class PostService {
  constructor(
    private prisma: PrismaService,
    private commentService: CommentService,
  ) {}

  create(dto: CreatePostDto) {
    return this.prisma.post.create({
      data: dto,
    });
  }

  async findAll(user_id: number) {
    return await this.prisma.post
      .findMany({
        where: {
          deleted_at: null,
        },
        include: {
          _count: {
            select: {
              comments: true,
              likes: true,
            },
          },
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
      .then(async (posts) => {
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
          }),
        );

        return enrichedPosts;
      });
  }
  async getPost(id: number, user_id: number) {
    const post = await this.prisma.post.findUnique({
      where: {
        id: id,
      },
      include: {
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });
    const comments = await this.commentService.findAllByPostId(id, user_id, 1);
    return {
      ...post,
      comments
    };
  }

  async findOne(id: number) {
    const post = await this.prisma.post.findUnique({
      where: {
        id: id,
      },
      include: {
        _count: {
          select: {
            comments: true,
          },
        },
        comments: {
          take: 10,
          include: {
            _count: {
              select: {
                likes: true,
              },
            },
            author: true,
          },
          orderBy: {
            created_at: 'desc',
          },
        },
      },
    });

    if (!post) throw new NotFoundException('post not found');

    return post;
  }

  async likePost(like: LikeDto) {
    return await this.prisma.post_like.create({
      data: {
        post_id: like.post_id,
        evaluator_id: like.evaluator_id,
        is_positive: true,
      },
    });
  }
  async deleteLikePost(like: LikeDto) {
    return await this.prisma.post_like.deleteMany({
      where: {
        post_id: like.post_id,
        evaluator_id: like.evaluator_id,
      },
    });
  }

  async update(id: number, dto: UpdatePostDto) {
    await this.findOne(id);

    return await this.prisma.post.update({
      where: {
        id: id,
      },
      data: dto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.post.update({
      where: {
        id: id,
      },
      data: {
        deleted_at: new Date(),
      },
    });
  }
}
