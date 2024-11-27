import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { hash } from 'bcrypt';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
    ) {}

    async getMainPage() {
        return 'User Main Page';
    }

    async register(email: string, password: string) {
        // 중복 유저 조회
        const existedUser = await this.userRepository.findOne({
            where: {
                email: email,
            },
        });

        if (existedUser) {
            throw new BadRequestException('이미 해당 이메일이 존재합니다.');
        }

        // bcrypt를 이용한 password 암호화
        const hashedPassword = await hash(password, 10);    // 10은 salt 값

        // save() 함수는 create, select를 동시에 해서 정보가 담겨있음
        const user = await this.userRepository.save({
            email: email,
            password: hashedPassword,
        });

        return user;
    }
}