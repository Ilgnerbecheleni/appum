/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable prettier/prettier */
import { ExecutionContext, createParamDecorator } from "@nestjs/common";


export const ParamId = createParamDecorator((_data:string , context:ExecutionContext)=>{
    return Number(context.switchToHttp().getRequest().params.id )  // pega o Id da requisicao e converte para numero
})