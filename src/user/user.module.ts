/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable prettier/prettier */
import { MiddlewareConsumer, Module, NestModule, RequestMethod, forwardRef } from "@nestjs/common";
import { UserController } from "./user.controller";
import { PrismaModule } from "src/Prisma/prisma.module";
import { UserService } from "./user.service";
import { UserIdCheckMiddleware } from "src/middlewares/user-id-check.middleware";
import { AuthModule } from "src/Auth/auth.module";


@Module({
    imports:[PrismaModule , forwardRef(()=>AuthModule) ],//recursos a importar
    controllers:[UserController],//controllers
    providers:[UserService],//provedores
    exports:[UserService] // fornecer acesso au auth
})
export class UserModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {

        consumer.apply(UserIdCheckMiddleware).forRoutes({
            path: 'users/:id',
            method: RequestMethod.ALL
        })


    }
}