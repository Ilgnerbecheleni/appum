/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { writeFile } from "fs/promises";
import { join } from "path";

@Injectable()
export class FileService{

    async upload(photo: Express.Multer.File , path){

        const result = await writeFile(path , photo.buffer);
        return result;
    }

}
