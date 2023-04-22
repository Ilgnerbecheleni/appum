/* eslint-disable prettier/prettier */
import { Module, forwardRef } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './Auth/auth.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';

@Module({
  imports: [
    ConfigModule.forRoot(),
    forwardRef(()=>UserModule) ,
    forwardRef(()=>AuthModule),ThrottlerModule.forRoot({
      ttl:60, // tempo
      limit:10, // numero de solicitacoes
    }),
    MailerModule.forRoot({
      // transport: 'smtps://ilgner_becheleni@hotmail.com:ilgner2131@smtp.office365.com',
      //transport: 'smtps://brown57@ethereal.email:GthZKQ2VCD87Q9zrwr@smtp.ethereal.email',
      // transport:{
      //   host: 'smtp.office365.com',
      //   port: 587,
      //   auth: {
      //       user: '<seu email>',
      //       pass: '<sua senha>'
      //   },
      transport:{
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'brown57@ethereal.email',
            pass: 'GthZKQ2VCD87Q9zrwr'
        }
    },
      defaults: {
        from: '"nest-modules" <modules@nestjs.com>',
      },
      template: {
        dir: __dirname + '/templates', //diretorio de template
        adapter: new PugAdapter(),
        options: {
          strict: true,
        },
      },
    }),

  ],
  controllers: [AppController],
  providers: [AppService ,{
    provide: APP_GUARD ,
    useClass:ThrottlerGuard
  }],
  exports: [AppService],
})
export class AppModule {}
