import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Put, Response } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { RolesGuard } from 'src/roles/roles.guard';
import { AccessGuard } from 'src/access/access.guard';
import { Role } from '@prisma/client';
import { Roles } from 'src/roles/roles.decorator';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @UseGuards(AuthGuard, RolesGuard, AccessGuard)
  @Roles(Role.admin, Role.moderator)
  @Post()
  create(@Body() dto: CreateChatDto) {
    return this.chatService.create(dto);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll(@Req() req) {
    return this.chatService.findAll(req.user.id);
  }

  @UseGuards(AuthGuard)
  @Get('messages/:chatId')
  getMessages(@Param('chatId') chat_id: string){//, @Response() res) {
    return this.chatService.getMessages(+chat_id);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.chatService.findOne(+id);
  // }

  @UseGuards(AuthGuard, RolesGuard, AccessGuard)
  @Roles(Role.admin, Role.moderator)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateChatDto) {
    return this.chatService.update(+id, dto);
  }

  @UseGuards(AuthGuard, RolesGuard, AccessGuard)
  @Roles(Role.admin, Role.moderator)
  @Put('add-user/:id')
  addUser(@Param('id') id: string, @Body('users_id') users_id: number[]) {
    return this.chatService.addUser(+id, users_id);
  }

  @UseGuards(AuthGuard, RolesGuard, AccessGuard)
  @Roles(Role.admin, Role.moderator)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chatService.remove(+id);
  }
}
