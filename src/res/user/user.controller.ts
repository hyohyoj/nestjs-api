import { Body, Controller, Get, Post } from "@nestjs/common";
import { UserService } from "./user.service";

@Controller('/user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get('/main')
    async getMainPage() {
        return this.userService.getMainPage();
    }

    @Post('register')
    async register(@Body() request) {
        const email = request?.email;
        const password = request?.password;

        return this.userService.register(email, password);
    }
}