/* eslint-disable prettier/prettier */
import { IsString, MinLength, IsEmail } from "class-validator";

export class AuthForgetDto{


@IsEmail()
email:string ;


}