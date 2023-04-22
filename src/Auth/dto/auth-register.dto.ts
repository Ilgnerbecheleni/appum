/* eslint-disable prettier/prettier */
import { IsString, MinLength, IsEmail, IsOptional, IsDateString, IsStrongPassword, IsEnum } from "class-validator";
import { Role } from "src/Enum/role.enum";

export class AuthRegisterDto{


    @IsString()
    name: string;


    @IsEmail()  //padroniza o email
    email:string;

    @IsOptional()
    @IsDateString()
    birthAt : string ;

    @IsStrongPassword({
        minLength:6,
        minNumbers:0,
        minLowercase:0,
        minSymbols:0,
        minUppercase:0,
    }) //padroniza o tipo de senha conforme a regra simbolos , letras e numeros
    password:string ;

    @IsOptional()
    @IsEnum(Role)
    role: number;

}