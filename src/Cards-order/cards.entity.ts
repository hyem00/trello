import { ManyToOne, BaseEntity, UpdateDateColumn, CreateDateColumn, Column, Entity, Unique, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Comments } from '../Comments/comments.entity'
import { Lists } from '../Lists/lists.entity'

@Entity()
@Unique(['cid']) // cardId 고유값 지정
export class Cards extends BaseEntity{

    @PrimaryGeneratedColumn()
    cid: number;

    @Column()
    lid: number;

    @Column()
    mid: number;

    @Column()
    position: number // 리스트 순서

    @Column()
    title: string;

    @Column()
    color: string;

    @Column()
    explanation: string;

    @Column()
    deadline: string;

    @Column()
    order: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    // 관계설정 따로 수정해주셔야 합니다.
    // // Cards-Lists : N:1 관계
    // @ManyToOne(type => Lists, list => list.lid, {eager: false})
    // lists: Lists[]

    // // Cards-Comments : 1:N 관계
    // @OneToMany(type => Comments, comment => comment.cid, {eager: true})
    // comments: Comments[]
}
