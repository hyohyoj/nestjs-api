import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './res/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        retryAttempts: 10,  // 연결 실패 시, 연결 재시도 횟수
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        database: 'nest',
        username: 'root',
        password: 'B2bjWQarzns5hao',
        entites: [
          path.join(__dirname, '/entities/**/*.entity.{js, ts}'),
        ],
        synchronize: false,
        logging: true,  // typeorm 쿼리 실행 시, 지정 DB의 쿼리문을 터미널에 보여줌
        timezone: 'local',
      }),
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
