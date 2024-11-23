import {
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
} from 'typeorm';

export class CommonBigPKEntity {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: string;

    @CreateDateColumn({ type: 'timestamp' })
    createDate: Date;

    @UpdateDateColumn({ type: 'timestamp', nullable: true })
    updateDate: Date | null;

    @DeleteDateColumn({ type: 'timestamp', nullable: true })
    deleteDate: Date | null;
}