import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { ArticleService } from "./article.service";
import { User } from "src/decorators/user.decorator";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";

@Controller('article')
export class ArticleController {
    constructor(private readonly articleService: ArticleService) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    async createArticle(@Body() body, @User() user) {
        const article = await this.articleService.createArticle(
            body?.title,
            body?.content,
            user.id,
        );

        return article;
    }
}