import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { AccessGuard } from 'src/access/access.guard';
import { AccessEntity } from 'src/access/entity.acces.enum';
import { Access } from 'src/access/access.decorator';

@Controller('comment')
@UseGuards(AuthGuard, AccessGuard)
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  create(@Body() dto: CreateCommentDto, @Request() req) {
    dto.author_id = req.user.id;
    return this.commentService.create(dto);
  }

  @Get('post/')
  findAllByPostId(@Param('id') id: string) {
    return this.commentService.findAllByPostId(+id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentService.findOneByPostId(+id);
  }

  @Access(AccessEntity.COMMENT)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCommentDto, @Request() req) {
    dto.author_id = req.user.id;
    return this.commentService.update(+id, dto);
  }

  @Access(AccessEntity.COMMENT)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.commentService.remove(+id);
  }
}
