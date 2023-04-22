/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable prettier/prettier */

import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/Prisma/prisma.service';
import { UpdatePutUserDto } from './dto/update-put-user.dto';
import { UpdatePaTchUserDto } from './dto/update-patch-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUserDto) {

    const salt = await bcrypt.genSalt();
    data.password = await bcrypt.hash(data.password  ,salt);

    return await this.prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        password: data.password,
      },
    });
  }

  async list() {
    return this.prisma.user.findMany({});
  }

  async show(id: number) {
    await this.exists(id); //verifica se o usuario existe
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async update(id:number ,  {name, email , password , birthAt , role} : UpdatePutUserDto ){

    await this.exists(id); //verifica se o usuario existe

    const salt = await bcrypt.genSalt();
    const passwordEnc  = await bcrypt.hash(password  ,salt);

    return this.prisma.user.update({


      data: {
        email: email,
        name: name,
        password: passwordEnc,
        birthAt: birthAt ? new Date(birthAt):null,
        role: role
      } ,
      where:{
        id:id
      }
    })
  }

  async updatePartial(id:number ,  {name, email , password , birthAt,role} : UpdatePaTchUserDto ){

    await this.exists(id);
    const data : any={}

    if(birthAt){
      data.birthAt = new Date(birthAt);
    }
    if(email){
      data.email = email ;
    }
    if(name){
      data.name = name ;
    }
    if(password){
      const salt = await bcrypt.genSalt();
      const passwordEnc  = await bcrypt.hash(password  ,salt);
      data.password = passwordEnc ;
    }
    if(role){
      data.role = role ;
    }

    return this.prisma.user.update({
      data,
      where:{
        id:id
      }
    })
  }

  async delete (id:number){

    await this.exists(id);

    return this.prisma.user.delete(
      {
        where:{
          id
        }
      }
    )
  }

  async exists(id:number){
    if(!(await this.prisma.user.count({
      where:{
        id
      }
    }))){
      throw new NotFoundException(`O usuario ${id} nao existe` );
    }
  }
}
