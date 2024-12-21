import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { AccessEntity } from './entity.acces.enum';

@Injectable()
export class AccessGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredAccess = this.reflector.getAllAndOverride<AccessEntity>(
      'entity',
      [context.getHandler(), context.getClass()],
    );
    if (!requiredAccess) return true;
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const id = request.params.id;
    
    if (user.role == Role.admin) return true;
    
    return this.IsOwner(requiredAccess, +user.subscriber, +id);
  }
  
  async IsOwner(requiredAccess: AccessEntity, userId: number, entityId){
    switch (requiredAccess) {
      case AccessEntity.USER:
        return entityId == userId ? true : false;
      case AccessEntity.POST:
        const post = await this.prisma.post.findUnique({
          where: {
            id: entityId,
            author_id: userId,
          },
        });
        return post ? true : false;
      case AccessEntity.COMMENT:
        const comment = await this.prisma.comment.findUnique({
          where: {
            id: entityId,
            author_id: userId,
          },
        });
        return comment ? true : false;
      default:
        break;
    }
  } 
}