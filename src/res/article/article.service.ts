import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
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
}