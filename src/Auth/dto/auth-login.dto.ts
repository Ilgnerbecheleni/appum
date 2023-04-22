/* eslint-disable prettier/prettier */
import { IsString, MinLength, IsEmail } from "class-validator";

export class AuthLoginDto{


@IsEmail()
email:string ;

@IsString()
@MinLength(6)
password:string;


}