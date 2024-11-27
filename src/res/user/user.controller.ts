import { Body, Controller, Get, Param, Post, Req, UnauthorizedException, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";

@Controller('/user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get('/main')
    async getMainPage() {
        return this.userService.getMainPage();
    }

    @Post('register')
    async register(@Body() body) {
        const email = body?.email;
        const password = body?.password;

        return this.userService.register(email, password);
    }

    @UseGuards(JwtAuthGuard)
    @Get('user-info/:id')
    async getUserInfo(@Req() req, @Param('id') id: string) {
        // JwtAuthGuard를 거치면서 로그인 여부 확인
        const user = req?.user;

        if (user.id !== id) {
            throw new UnauthorizedException();
        }

        return `${user.email} >>> user-info Page`;
    } 
}