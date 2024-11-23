import * as path from "path";
import { DataSource } from "typeorm";
import * as dotenv from 'dotenv';

dotenv.config({ path: `.env.dev` });

export const dataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    entities: [ // entity는 DB의 테이블을 지칭.
        path.join(__dirname, 'src/entities/**/*.entity.ts'),
        path.join(__dirname, 'dist/entities/**/*.entity.ts'),
    ],
    synchronize: false,
    logging: true,
});