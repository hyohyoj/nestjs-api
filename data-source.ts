import * as path from "path";
import { DataSource } from "typeorm";

export const dataSource = new DataSource({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    database: 'nest',
    username: 'root',
    password: 'B2bjWQarzns5hao',
    entities: [ // entity는 DB의 테이블을 지칭.
        path.join(__dirname, 'src/entities/**/*.entity.ts'),
        path.join(__dirname, 'dist/entities/**/*.entity.ts'),
    ],
    synchronize: false,
    logging: true,
});