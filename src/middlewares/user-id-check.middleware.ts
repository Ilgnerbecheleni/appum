/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable prettier/prettier */
import { BadRequestException, NestMiddleware } from "@nestjs/common";
import { Request,Response, NextFunction } from "express";

export class UserIdCheckMiddleware implements NestMiddleware {

    use(req: Request, res: Response , next : NextFunction ){
        console.log('UserCheckMiddleware', 'Antes');
        if(isNaN(Number( req.params.id )) || Number( req.params.id )<=0 ){
            throw new BadRequestException ("Id Invalido");
        }
        console.log('UserCheckMiddleware', 'Depois');
        next();
    }

}