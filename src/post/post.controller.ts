import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  Request,
  UseGuards,
  Response,
  Req,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Roles } from 'src/roles/roles.decorator';
import { Role } from '@prisma/client';
import { RolesGuard } from 'src/roles/roles.guard';
import { AuthGuard } from 'src/auth/auth.guard';
import { AccessGuard } from 'src/access/access.guard';
import { Access } from '../access/access.decorator';
import { AccessEntity } from '../access/entity.acces.enum';
import { LikeDto } from './dto/like.dto';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(AuthGuard, RolesGuard, AccessGuard)
  @Roles(Role.admin, Role.moderator)
  @Post('new/')
  create(@Body() dto: CreatePostDto) {
    return this.postService.create(dto);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll(@Request() req) {
    return this.postService.findAll(req.user.id);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.postService.getPost(+id, req.user.id);
  }

  @UseGuards(AuthGuard, RolesGuard, AccessGuard)
  @Access(AccessEntity.POST)
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePostDto) {
    return this.postService.update(+id, dto);
  }

  @UseGuards(AuthGuard)
  @Post('likePost')
  setLike(@Body() like: LikeDto, @Request() req) {
    like.evaluator_id = req.user.id;
    return this.postService.likePost(like);
  }
  @UseGuards(AuthGuard)
  @Delete('likePost')
  deleteLike(@Body() like: LikeDto, @Request() req) {
    like.evaluator_id = req.user.id;
    return this.postService.deleteLikePost(like);
  }

  @UseGuards(AuthGuard, RolesGuard, AccessGuard)
  @Access(AccessEntity.POST)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postService.remove(+id);
  }
}
