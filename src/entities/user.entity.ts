import { Column, Entity, OneToMany } from 'typeorm';
import { ArticleEntity } from './article.entity';
import { CommentEntity } from './comment.entity';
import { CommonBigPKEntity } from './common/common.entity';

@Entity('User')
export class UserEntity extends CommonBigPKEntity {
    @Column('varchar', { unique: true, nullable: false })
    email: string;

    @Column('varchar', { unique: false, nullable: false })
    password: string;

    @OneToMany(() => ArticleEntity, (article) => article.user)
    articles: ArticleEntity[];

    @OneToMany(() => CommentEntity, (comment) => comment.user)
    comments: CommentEntity[];
}
