import { Entity, Unique,BaseEntity, UpdateDateColumn, OneToMany, CreateDateColumn, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Boards } from '../Boards/boards.entity'
import { Cards } from '../Cards/cards.entity'

@Entity()
@Unique(['lid']) // listId 고유값 지정
export class Lists extends BaseEntity {
    @PrimaryGeneratedColumn()
    lid: number;

    @Column()
    bid: number

    @Column()
    title: string

    @Column()
    content: string

    @Column()
    order: string

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    // 관계설정 따로 수정해주셔야 합니다.
    // // Lists-Boards : N:1 관계
    // @ManyToOne(type => Boards, boards.list,{eager:false})
    // boards: Boards;

    // // Lists-Cards : 1:N 관계
    // @OneToMany(type => Cards, cards.boards,{eager:false})
    // cards: Cards;
}