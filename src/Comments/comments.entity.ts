import {
  BaseEntity,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Column,
  Entity,
  Unique,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Cards } from '../Cards/cards.entity';
import { Users } from 'src/Users/users.entity';

@Entity()
@Unique(['commentId']) // commentId 고유값 지정
export class Comments extends BaseEntity {
  @PrimaryGeneratedColumn()
  commentId: number;

  @Column()
  cid: number;

  // @Column()
  // uid: number;

  @Column()
  comment: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // // Comments-Cards : N:1 관계
  @ManyToOne(() => Cards, (cards) => cards.comments) 
  @JoinColumn({ name: 'cid' })
  cards: Cards;

  // Comments-Users : N:1 관계
  @ManyToOne(() => Users, (users) => users.comments)
  @JoinColumn({ name: 'uid' })
  users: Users;
}
