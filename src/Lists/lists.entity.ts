import { Entity, Unique, BaseEntity, BeforeInsert, UpdateDateColumn, OneToMany, CreateDateColumn, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, RelationId } from 'typeorm';
import { Boards } from '../Boards/boards.entity';
import { Cards } from '../Cards/cards.entity';

@Entity()
@Unique(['lid']) // listId 고유값 지정
export class Lists extends BaseEntity {
  @PrimaryGeneratedColumn()
  lid: number;

  @Column()
  @RelationId((list: Lists) => list.boards)
  bid: number;

  @Column({ default: 1 })
  order: number; // 리스트 순서

  @Column()
  title: string;

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

  // Lists : Boards = N:1 관계
  @ManyToOne(() => Boards, (boards) => boards.lists)
  @JoinColumn({ name: 'bid' })
  boards: Boards;

  // Lists : Cards = 1:N 관계
  @OneToMany(() => Cards, (cards) => cards.lists)
  cards: Cards;
}
