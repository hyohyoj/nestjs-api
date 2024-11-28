import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { ArticleService } from "./article.service";
import { User } from "src/decorators/user.decorator";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { CreateArticleDto } from "src/dtos/articles/create-article.dto";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags('게시글 API')
@Controller('article')
export class ArticleController {
    constructor(private readonly articleService: ArticleService) {}

    @ApiOperation({
        summary: '게시글 작성 API',
        description: '유저가 게시글을 작성한다.',
    })
    @ApiBody({
        type: CreateArticleDto,
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Post()
    async createArticle(@Body() body: CreateArticleDto, @User() user) {
        const article = await this.articleService.createArticle(
            body.title,
            body.content,
            user.id,
        );

        return article;
    }

    @Get('/:id')
    async readArticle(@Param('id') id) {
        const article = await this.articleService.getArticle(id);

        return article;
    }

    @UseGuards(JwtAuthGuard)
    @Put('/:id')
    async updateArticle(@Param('id') articleId, @User() user, @Body() body) {
        const res = await this.articleService.modifyArticle(
            user.id,
            articleId,
            body?.title,
            body?.content,
        );

        return res;
    }

    @UseGuards(JwtAuthGuard)
    @Delete('/:id')
    async deleteArticle(@Param('id') articleId, @User() user) {
        const res = await this.articleService.removeArticle(user.id, articleId);

        return res;
    }
}