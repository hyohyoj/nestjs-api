import { Controller, Post, Req, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags('인증 API')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @ApiOperation({
        summary: '로그인 API',
        description: '사용자가 로컬 로그인을 합니다.',
    })
    @ApiBody({})
    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Req() req) {
        // 로그인 시, LocalAuthGuard를 거치게 되면서 request에 user 객체가 생성됨.
        const user = req?.user;

        console.log('user : ', user);

        return this.authService.login(user);
    }
}