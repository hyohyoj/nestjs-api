import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config/dist';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './res/user/user.module';

console.log(`.env.${process.env.NODE_ENV}`);

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
      isGlobal: true, // 다른 모듈에서 별도의 설정없이 환경변수 사용 가능
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        retryAttempts: configService.get('NODE_ENV') === 'prod' ? 10 : 1,  // 연결 실패 시, 연결 재시도 횟수
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: Number(configService.get('DB_PORT')),
        database: configService.get('DB_NAME'),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASSWORD'),
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
