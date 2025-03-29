import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UserService {

  constructor(private prisma: PrismaService) {}


  create(dto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all user`;
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id
      }
    });

    if(!user) throw new NotFoundException('user not found');

    return user;
  }

  async getName(id: number){
    const user = await this.prisma.user.findUnique({
      select:{
        name: true,
      },
      where: {
        id: id
      }
    });

    if(!user) throw new NotFoundException('user not found');
    return user.name;
  }

  async findOneByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: email
      }
    });

    if(!user) throw new NotFoundException('user not found');

    return user;
  }

  update(id: number, dto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
