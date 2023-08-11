import { Entity, Unique,BaseEntity, BeforeInsert, UpdateDateColumn, OneToMany, CreateDateColumn, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn , RelationId } from 'typeorm';
import { Boards } from '../Boards/boards.entity'
import { Cards } from '../Cards/cards.entity'

@Entity()
@Unique(['lid']) // listId 고유값 지정
export class Lists extends BaseEntity {
    @PrimaryGeneratedColumn()
    lid: number;

    @Column()
    @RelationId((list : Lists )=> list.boards)
    bid : number

    @Column()
    position: number // 리스트 순서

    @Column()
    title: string

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    // @BeforeInsert() // position 1씩 자동증가
    // async setPosition() {
    //     if(!this.position){
    //     const lastList = await Lists.findOne({
    //         order: {
    //             position: 'DESC'
    //         }
    //     })
    //     this.position = lastList ? lastList.position + 1 : 1;
    // }
    // }

  // 리스트 : 보드 =N:1 관계
  @ManyToOne(() => Boards, (boards) => boards.lists)
  @JoinColumn({ name: 'bid'})
  boards: Boards;

//   // 리스트 - 카드 1:N 관계
//   OneToMany(() => Lists, (lists) => lists.cards)
//   members: Members;
// }

    // 관계설정 따로 수정해주셔야 합니다.
    // // Lists-Boards : N:1 관계
    // @ManyToOne(type => Boards, boards.list,{eager:false})
    // boards: Boards;

    // // Lists-Cards : 1:N 관계
    // @OneToMany(type => Cards, cards.boards,{eager:false})
    // cards: Cards;
}