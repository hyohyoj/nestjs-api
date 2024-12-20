import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config/dist';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './res/user/user.module';
import { UserEntity } from './entities/user.entity';
import { ArticleEntity } from './entities/article.entity';
import { CommentEntity } from './entities/comment.entity';
import { AuthModule } from './auth/auth.module';
import { ArticleModule } from './res/article/article.module';
import { CommentModule } from './res/comment/comment.module';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { undefinedToNullInterceptor } from './interceptors/undefinedToNull.interceptor';
import { HttpExceptionFilter } from './filter/http-exception.filter';

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
        // 윈도우 환경의 경우 path.join으로 entity를 가져올 시, 읽히지 않는 이슈 발생
        // entities: [
        //   path.join(__dirname, '/entities/**/*.entity.{js, ts}'),
        // ],
        entities: [
          UserEntity, ArticleEntity, CommentEntity
        ],
        synchronize: false,
        logging: true,  // typeorm 쿼리 실행 시, 지정 DB의 쿼리문을 터미널에 보여줌
        timezone: 'local',
      }),
    }),
    UserModule,
    AuthModule,
    ArticleModule,
    CommentModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: undefinedToNullInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_PIPE,
      useClass: ValidationPipe, // class-validator 추가 (DTO, Entity 데이터 타입 검증)
    },
  ],
})
export class AppModule {}
