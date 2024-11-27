import { Injectable, UnauthorizedException } from "@nestjs/common";
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

    async createArticle(title: string, content: string, userId: string) {
        const article = await this.articleRepository.save({
            title: title,
            content: content,
            userId: userId,
        });

        return article;
    }

    async getArticle(articleId: string) {
        const article = await this.articleRepository.findOne({
            where: {
                id: articleId,
            },
        });

        return article;
    }

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
}