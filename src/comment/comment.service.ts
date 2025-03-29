import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PrismaService } from 'src/prisma.service';
import { LikeDto } from 'src/post/dto/like.dto';
import { PaginationQuery } from 'src/app.module';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: number) {
    const post = await this.prisma.comment.findUnique({
      where: {
        id: id,
      },
      include: {
        _count: {
          select: {
            likes: true,
          },
        },
        author: {
          select: {
            name: true,
            role: true,
          },
        },
      }
    });

    if (!post) throw new NotFoundException('comment not found');

    return post;
  }

  async create(dto: CreateCommentDto) {
    const newComment = await this.prisma.comment.create({
      data: {
        text: dto.text,
        answer: dto.answer,
        post_id: dto.post_id,
        author_id: dto.author_id,
        updated_at: null
      },
    });
    return await this.findOne(newComment.id);
  }

  async findAllByPostId(id: number, userId: number, page: any) {
    const pagination = new PaginationQuery();
    pagination.page = page;
    pagination.limit = 6;
    pagination.offset = (page - 1) * pagination.limit;

    return await this.getComments(id, userId, pagination);
  }

  async findAllByPostIdUpToPage(id: number, userId: number, page: any) {
    const pagination = new PaginationQuery();
    pagination.page = page;
    pagination.limit = 6 * (page-1);

    return await this.getComments(id, userId, pagination);
  }

  async getComments(id: number, userId: number, pagination: PaginationQuery){
    const comments = await this.prisma.comment
      .findMany({
        where: {
          post_id: id,
        },
        skip: pagination.offset,
        take: pagination.limit,
        include: {
          _count: {
            select: {
              likes: true,
            },
          },
          author: {
            select: {
              name: true,
              role: true,
            },
          },
        },
        orderBy: {
          created_at: 'desc',
        },
      })
      .then(async (comments) => {
        const enrichedComments = await Promise.all(
          comments.map(async (comment) => {
            const commentLike = await this.prisma.comment_like.count({
              where: {
                comment_id: comment.id,
                evaluator_id: userId,
              },
            });

            if (comment.answer) {
              const replyToComment = await this.prisma.comment.findUnique({
                where: {
                  id: comment.answer,
                },
              });

              const replyTo = await this.prisma.user.findUnique({
                where:{
                  id: replyToComment.author_id
                },
                select:{
                  name: true
                }
              });
              comment['reply'] = replyTo;
              return {
                ...comment,
                comment_is_liked: commentLike > 0, // true, если лайк найден
              };
            }

            return {
              ...comment,
              comment_is_liked: commentLike > 0, // true, если лайк найден
            };
          }),
        );
        return enrichedComments;
      });

      const totalCount = await this.prisma.comment.count({
        where:{
          post_id: id
        }
      });
      const hasMore = pagination.offset + comments.length < totalCount;
      return {
        comments,
        hasMore,
      };
  }

  findOneByPostId(id: number) {
    return this.prisma.comment.findFirst({
      where: {
        post_id: id,
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  async likeComment(like: LikeDto) {
    return await this.prisma.comment_like.create({
      data: {
        comment_id: like.comment_id,
        evaluator_id: like.evaluator_id,
        is_positive: true,
      },
    });
  }
  async deleteLikeComment(like: LikeDto) {
    return await this.prisma.comment_like.deleteMany({
      where: {
        comment_id: like.comment_id,
        evaluator_id: like.evaluator_id,
      },
    });
  }

  async update(id: number, dto: UpdateCommentDto) {
    const comment = this.findOne(id);

    return await this.prisma.post.update({
      where: {
        id: id,
      },
      data: dto,
    });
  }

  async remove(id: number) {
    const comment = this.findOne(id);

    return await this.prisma.post.update({
      where: {
        id: id,
      },
      data: {
        deleted_at: new Date(),
      },
    });
  }
}
