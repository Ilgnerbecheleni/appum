/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable prettier/prettier */
import { BadRequestException, Body, Controller, FileTypeValidator, MaxFileSizeValidator, ParseFilePipe, Post, UploadedFile, UploadedFiles, UseGuards,UseInterceptors } from "@nestjs/common";
import { AuthLoginDto } from "./dto/auth-login.dto";
import { AuthRegisterDto } from "./dto/auth-register.dto";
import { AuthForgetDto } from "./dto/auth-forget.dto";
import { AuthResetDto } from "./dto/auth-reset.dto";
import { UserService } from "src/user/user.service";

import { AuthService } from "./auth.service";
import { AuthGuard } from "src/guards/auth.guard";
import { User } from "src/Decorator/user.decorator";
import { FileInterceptor, FilesInterceptor , FileFieldsInterceptor } from "@nestjs/platform-express";
import { join } from "path";
import { FileService } from "src/file/file.service";

@Controller('auth')
export class  AuthController {

    constructor(
        private readonly userService : UserService ,
        private readonly authService: AuthService,
        private readonly fileService: FileService
         ){}

    @Post('login')
     async login(@Body() {email , password} : AuthLoginDto){
        return this.authService.login(email,password);
    }

    @Post('register')
    async register (@Body() body : AuthRegisterDto){

        return this.authService.register(body);
    }

    @Post('forget')
    async forget(@Body() {email} : AuthForgetDto){
       return this.authService.forget(email)
    }
    @Post('reset')
    async reset(@Body() {password,token} : AuthResetDto){

        return this.authService.reset(password , token)


    }
    @UseGuards(AuthGuard) // guard da rota
    @Post('me')
    async me(@User('email') user){  //tem meu decorator personalizado para retornar o usuario , esse decorator usa o guard que executa antes da solicitacao
      return {me:"ok" ,user };
    }

    @UseInterceptors(FileInterceptor('file')) // trata arquivo e adiciona o campo que esta recebendo o arquivo e o decorator UploadedFile()
    @UseGuards(AuthGuard) // guard da rota
    @Post('photo')
    async uploadPhoto(@User() user, @UploadedFile(new ParseFilePipe({
        validators:[
            new FileTypeValidator({fileType:'image/png'}),//validator do tipo de arquivo , isso e nativo
            new MaxFileSizeValidator({maxSize:1024*20}) // numero de bytes que pode ter
        ]
     }))photo: Express.Multer.File){  //tem meu decorator personalizado para retornar o usuario , esse decorator usa o guard que executa antes da solicitacao

        const path = join(__dirname,'..','..','storage/photos',`photo-${user.id}.png`);

        try {
            this.fileService.upload(photo , path);
        } catch (error) {
            throw new BadRequestException("Nao foi possivel realizar o upload")
        }
      return {sucess:true}
    }


    @UseInterceptors(FilesInterceptor('files')) // trata arquivo e adiciona o campo que esta recebendo o arquivo e o decorator UploadedFiles()
    @UseGuards(AuthGuard) // guard da rota
    @Post('files')
    async uploadFiles(@User() user, @UploadedFiles()files: Express.Multer.File[]){  //tem meu decorator personalizado para retornar o usuario , esse decorator usa o guard que executa antes da solicitacao

      return files;
    }

    @UseInterceptors(FileFieldsInterceptor([{
        name: 'photo',
        maxCount:1 ,
         },{
            name:'documents',
            maxCount:2
         }
        ])) // trata arquivo e adiciona o campo que esta recebendo o arquivo e o decorator UploadedFiles()
    @UseGuards(AuthGuard) // guard da rota
    @Post('files-fields')
    async uploadFilesFileds(@User() user, @UploadedFiles()files:{photo: Express.Multer.File , documents: Express.Multer.File[]} ){  //tem meu decorator personalizado para retornar o usuario , esse decorator usa o guard que executa antes da solicitacao

      return files ;
    }
}


//RBAC

