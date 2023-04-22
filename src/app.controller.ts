import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Post() // colocando string aqui a rota se torna a rota principal + a rota adicionada
  getPost(): string {
    return this.appService.getPost();
  }
}
