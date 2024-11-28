import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { CommentService } from "./comment.service";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { User } from "src/decorators/user.decorator";

@Controller('comment')
export class CommentController {
    constructor(private readonly commentService: CommentService) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    async createComment(@Body() body, @User() user) {
        const comment = await this.commentService.createComment(
            user.id,
            body.articleId,
            body.content,
            body?.parentId, // 부모가 없는 경우 undefined
        );

        return comment;
    }

    @Get()
    async readComment() {

    }

    @UseGuards(JwtAuthGuard)
    @Put('/:id')
    async updateComment(@Param('id') commentId, @User() user, @Body() body) {
        const res = await this.commentService.modifyComment(
            user.id,
            commentId,
            body.content,
        );

        return res;
    }

    @UseGuards(JwtAuthGuard)
    @Delete('/:id')
    async deleteComment(@Param('id') commentId, @User() user) {
        const res = await this.commentService.removeComment(
            user.id,
            commentId,
        );

        return res;
    }
}