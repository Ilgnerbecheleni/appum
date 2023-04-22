/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { PrismaService } from 'src/Prisma/prisma.service';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { MailerService } from '@nestjs-modules/mailer/dist';

@Injectable()
export class AuthService {

    private issuer ="login";
    private audience = "users";

    constructor(
    private readonly jtwService: JwtService,
    private readonly prisma: PrismaService,
    private readonly userService : UserService,
    private readonly mailer : MailerService
  ) {}

   createToken(user:User) {
    return {
        token: this.jtwService.sign({
            id:user.id,
            name:user.name,
            email:user.email
        },{
            expiresIn: "7 days",
            subject:String(user.id),
            issuer:this.issuer,
            audience:this.audience
        })
        }
  }

   checkToken(token: string) {
    try {

        const data =  this.jtwService.verify(token ,{
            issuer:this.issuer,
            audience:this.audience

        })


        return data ;
    } catch (e) {
        throw new BadRequestException(e)
    }

  }

   isValidToken(token: string) {
    try {
       this.checkToken(token);
        return true ;

    } catch (e) {
        return false ;
    }
}

  async login(email: string, password: string) {


    const user = await this.prisma.user.findFirst({
      where: {
        email,
        },
    });

    if (!user) {
      throw new UnauthorizedException('E-mail ou senha estao incorretos');
    }



   if( !await bcrypt.compare(password , user.password)){
    throw new UnauthorizedException('E-mail ou senha estao incorretos');
   }



    return this.createToken(user);
  }

  async forget(email: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        email,
      },
    });



    const token = this.jtwService.sign({
      id:user.id
    },
    {
      expiresIn: "30 min",
      subject:String(user.id),
      issuer:'forget',
      audience:'users'
  }
    )
    await this.mailer.sendMail({
      subject: "recuperacao de senha",
      to: email,
      template: 'forget',
      context: {
        name: user.name,
        token
      }
    });

    if (!user) {
      throw new UnauthorizedException('E-mail incorreto');
    }

    //Enviar e-mail de autorizacao
    return {sucess:true};
  }

  async reset(password: string, token: string) {
    //validar token ...
    try {

      const data:any =  this.jtwService.verify(token ,{

        issuer:'forget',
      audience:'users'

      })


      if(isNaN(Number(data.id))){
        throw new BadRequestException("token invalido");
      }
      const salt = await bcrypt.genSalt();
      const passwordEnc  = await bcrypt.hash(password  ,salt); // hassh da nova senha


      const user = await this.prisma.user.update({
        where: {
          id:data.id,
        },
        data: {
          password:passwordEnc
        }
      });

      return this.createToken(user);


  } catch (e) {
      throw new BadRequestException(e)
  }


    //


  }

  async register(data:AuthRegisterDto){
    const user = await this.userService.create(data);
    return this.createToken(user);
  }
}
