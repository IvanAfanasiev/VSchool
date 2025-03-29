import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
  Query,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { AccessEntity } from 'src/access/entity.acces.enum';
import { Access } from 'src/access/access.decorator';
import { LikeDto } from 'src/post/dto/like.dto';

@Controller('comment')
@UseGuards(AuthGuard)
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  create(@Body() dto: CreateCommentDto, @Request() req) {
    dto.author_id = req.user.id;
    return this.commentService.create(dto);
  }

  @Get('post/:id')
  findAllByPostId(@Param('id') id: string, @Query('page') page: number, @Request() req) {
    return this.commentService.findAllByPostId(+id, req.user.id, page);
  }

  @Get('post/upTo/:id')
  findAllByPostIdUpToPage(@Param('id') id: string, @Query('page') page: number, @Request() req) {
    return this.commentService.findAllByPostIdUpToPage(+id, req.user.id, page);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentService.findOneByPostId(+id);
  }

  @Post('likeComment')
  setLike(@Body() like: LikeDto, @Request() req) {
    like.evaluator_id = req.user.id;
    return this.commentService.likeComment(like);
  }
  @Delete('likeComment')
  deleteLike(@Body() like: LikeDto, @Request() req) {
    like.evaluator_id = req.user.id;
    return this.commentService.deleteLikeComment(like);
  }

  @Access(AccessEntity.COMMENT)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateCommentDto,
    @Request() req,
  ) {
    dto.author_id = req.user.id;
    return this.commentService.update(+id, dto);
  }

  @Access(AccessEntity.COMMENT)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.commentService.remove(+id);
  }
}
