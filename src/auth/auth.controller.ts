import { Controller, Post, Req, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./guards/local-auth.guard";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Req() req) {
        // 로그인 시, LocalAuthGuard를 거치게 되면서 request에 user 객체가 생성됨.
        const user = req?.user;

        console.log('user : ', user);

        return this.authService.login(user);
    }
}