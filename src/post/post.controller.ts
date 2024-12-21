import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Request, UseGuards, Response } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Roles } from 'src/roles/roles.decorator';
import { Role } from 'src/roles/role.enum';
import { RolesGuard } from 'src/roles/roles.guard';
import { AuthGuard } from 'src/auth/auth.guard';
import { AccessGuard } from 'src/access/access.guard';
import { Access } from '../access/access.decorator';
import { AccessEntity } from '../access/entity.acces.enum';

@Controller('post')
@UseGuards(AuthGuard, RolesGuard, AccessGuard)
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('new/')
  @Roles(Role.ADMIN, Role.MODER)
  create(@Body() dto: CreatePostDto) {
    return this.postService.create(dto);
  }

  @Get() 
  findAll() {
    return this.postService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(+id);
  }
  
  @Access(AccessEntity.POST)
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePostDto) {
    return this.postService.update(+id, dto);
  }

  @Access(AccessEntity.POST)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postService.remove(+id);
  }
}
