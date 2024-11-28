import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ErrorMessages } from "src/config/error.messages";
import { CommentEntity } from "src/entities/comment.entity";
import { Repository } from "typeorm";

@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(CommentEntity)
        private readonly commentRepository: Repository<CommentEntity>,
    ) {}

    /** 댓글 작성 */
    async createComment(
        userId: string, 
        articleId: string, 
        content: string, 
        parentId: string,
    ) {
        const comment = await this.commentRepository.save({
            userId: userId,
            articleId: articleId,
            content: content,
            parentId: parentId
        });

        return comment;
    }

    /** 댓글 수정 */
    async modifyComment(userId: string, commentId: string, content: string) {
        const comment = await this.commentRepository.findOne({
            where: {
                id: commentId,
                userId: userId,
            },
        });

        if (!comment) {
            throw new BadRequestException(ErrorMessages.COMMENT_ACCESS_DENIED);
        }
        
        const updateResult = await this.commentRepository.update(
            { id: commentId },
            {
                content: content,
            },
        );

        return { affected: updateResult?.affected };
    }

    /** 댓글 삭제 */
    async removeComment(userId: string, commentId: string) {
        const comment = await this.commentRepository.findOne({
            where: {
                id: commentId,
                userId: userId,
            },
        });

        // 이미 삭제된 댓글일 경우
        if (!comment) {
            throw new BadRequestException(ErrorMessages.COMMENT_NOT_FOUND);
        }

        const deleteResult = await this.commentRepository.softDelete({
            id: commentId,
            userId: userId,
        });

        return { affected: deleteResult?.affected };
    }
}