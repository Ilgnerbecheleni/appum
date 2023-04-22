/* eslint-disable prettier/prettier */
import { PartialType } from "@nestjs/mapped-types";
import { CreateUserDto } from "./create-user.dto";

export class UpdatePaTchUserDto extends PartialType(CreateUserDto) {

}