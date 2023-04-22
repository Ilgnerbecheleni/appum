/* eslint-disable prettier/prettier */
import { CanActivate, ExecutionContext, Inject, Injectable, forwardRef } from "@nestjs/common";
import { AuthService } from "src/Auth/auth.service";
import { UserService } from "src/user/user.service";

@Injectable()
export class AuthGuard implements CanActivate{

    constructor(

      private readonly authService : AuthService ,

      private readonly userService : UserService ){}


    async canActivate(context: ExecutionContext){

        const request = context.switchToHttp().getRequest();
        const {authorization} = request.headers;
        try{
          const data =  this.authService.checkToken((authorization ?? '').split(' ')[1] );
            request.tokenPayload = data;

            request.user = await this.userService.show(data.id);



          return  true;
        }catch(e){

        }


    }


}