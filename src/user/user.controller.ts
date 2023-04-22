/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, UseGuards, UseInterceptors } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdatePutUserDto } from "./dto/update-put-user.dto";
import { UpdatePaTchUserDto } from "./dto/update-patch-user.dto";
import { UserService } from "./user.service";
import { LogInterceptor } from "src/interceptors/log.interceptor";
import { ParamId } from "src/Decorator/param-id.decorator";
import { Roles } from "src/Decorator/roles.decorator";
import { Role } from "src/Enum/role.enum";
import { RoleGuard } from "src/guards/role.guard";
import { AuthGuard } from "src/guards/auth.guard";
import { ThrottlerGuard } from "@nestjs/throttler";

@Roles(Role.Admin)
@UseGuards(AuthGuard , RoleGuard)
@UseInterceptors(LogInterceptor ) // intercepta as rotas e executa uma acao
@Controller('users')
export class UserController {

    constructor(private readonly userservice : UserService){} // construtor para usar o servico de acesso ao banco , nao precisa importar pq esta no mesmo modulo , se tivesse em outro modulo deveria importar no user.module
@UseGuards(ThrottlerGuard)
@Post()
async create (@Body() data: CreateUserDto) {     //decorator para receber um corpo de requisiacao , garante que o corpo e do tipo CreateUserDto , valida o OBJETO
    return this.userservice.create(data); // utiliza o metodo create para gravar os dados , nao precisa await pq o return ja e uma promisse
}

@Roles(Role.Admin,  Role.User)
@Get()
async read (){
    return this.userservice.list() ;
}

@Get(':id') // sempre recebe String , ficar atento a isso  decorator ParamId personalizado
async readone (@ParamId() id: number){
    return this.userservice.show(id) ;
}
// @Roles(Role.Admin)
@Put(':id')
async update (@Body() data:UpdatePutUserDto ,@Param('id',ParseIntPipe) id: number){
    return this.userservice.update(id , data);
}

@Patch(':id')
async updatePartial (@Body() data:UpdatePaTchUserDto ,@Param('id',ParseIntPipe) id: number){
    return this.userservice.updatePartial(id , data);
}

@Delete(':id')
async delete (@Param('id',ParseIntPipe) id: number){
    return this.userservice.delete(id);
}


}