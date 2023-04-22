/* eslint-disable prettier/prettier */
import {  IsStrongPassword, IsJWT } from "class-validator";

export class AuthResetDto{

    @IsStrongPassword({
        minLength:6,
        minNumbers:0,
        minLowercase:0,
        minSymbols:0,
        minUppercase:0,
    }) //padroniza o tipo de senha conforme a regra simbolos , letras e numeros
    password:string ;

    @IsJWT()
    token: string;
}