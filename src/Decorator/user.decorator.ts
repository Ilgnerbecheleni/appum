/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable prettier/prettier */
import { ExecutionContext, NotFoundException, createParamDecorator } from "@nestjs/common";


export const User = createParamDecorator((filter:string , context:ExecutionContext)=>{  ///únderline deixa opicional
   const request = context.switchToHttp().getRequest();
   if(request.user) {
    if(filter){
        return request.user[filter];
    }
    return request.user ;
   }else{
    throw new NotFoundException ("usuario nao encontrado no Request . Use AuthGuard para obter usuario")
   }

})