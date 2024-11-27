import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "src/entities/user.entity";
import { Repository } from "typeorm";
import { compare } from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { ErrorMessages } from "src/config/error.messages";

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,

        private readonly jwtService: JwtService,
    ) {}

    async validateUser(email: string, password: string) {
        // 회원 정보 확인
        const user = await this.userRepository.findOne({
            where: {
                email: email
            },
        });

        if (!user) {
            throw new BadRequestException(ErrorMessages.USER_NOT_FOUND);
        }

        // 패스워드 확인
        const isPasswordMatch = await compare(password, user.password);

        if (!isPasswordMatch) {
            throw new BadRequestException(ErrorMessages.INVALID_CREDENTIALS);
        }

        return {
            id: user.id,
            email: user.email,
            createDate: user.createDate,
            updateDate: user.updateDate,
        };
    }

    async login(user) {
        return {
            accessToken: this.jwtService.sign(user),    // jwt 토큰 발급
        };
    }
}