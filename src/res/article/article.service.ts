import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ErrorMessages } from "src/config/error.messages";
import { ArticleEntity } from "src/entities/article.entity";
import { Repository } from "typeorm";

@Injectable()
export class ArticleService {
    constructor(
        @InjectRepository(ArticleEntity)
        private readonly articleRepository: Repository<ArticleEntity>,
    ) {}

    /** 게시글 작성 */
    async createArticle(title: string, content: string, userId: string) {
        const article = await this.articleRepository.save({
            title: title,
            content: content,
            userId: userId,
        });

        return article;
    }

    /** 게시글 조회 */
    async getArticle(articleId: string) {
        // comment 테이블과 조인
        const article = await this.articleRepository.findOne({
            where: {
                id: articleId,
            },
            relations: {
                comments: true,
            },
        });

        return article;
    }

    /** 게시글 수정 */
    async modifyArticle(userId: string, articleId: string, title: string, content: string) {
        const article = await this.articleRepository.findOne({
            where: {
                id: articleId,
                userId: userId,
            },
        });

        if (!article) {
            throw new UnauthorizedException(ErrorMessages.ARTICLE_ACCESS_DENIED);
        }
        
        // update 함수 첫 번째 인자는 조건, 두 번째 인자는 수정내용
        const updateResult = await this.articleRepository.update(
            { id: articleId },
            {
                title: title,
                content: content,
            },
        );

        // update 함수 결과 값에는 affected 속성이 담김 (수정 성공여부)
        return { affected: updateResult?.affected };
    }

    /** 게시글 삭제(논리 삭제) */
    async removeArticle(userId: string, articleId: string) {
        const article: ArticleEntity | null = await this.articleRepository.findOne({
            where: {
                id: articleId,
                userId: userId,
            },
        });
        
        // 이미 삭제된 게시글일 경우
        if (!article) {
            throw new BadRequestException(ErrorMessages.ARTICLE_NOT_FOUND);
        }

        const deleteResult = await this.articleRepository.softDelete({
            id: articleId,
            userId: userId,
        });

        return { affected: deleteResult?.affected };
    }
}