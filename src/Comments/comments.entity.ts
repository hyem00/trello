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
  // @ManyToOne(type => Cards, cards => cards.comments, {eager: false})
  // cards: Cards[]

  @ManyToOne(() => Users, (users) => users.comments) // user.comments와 연결
  @JoinColumn({ name: 'uid' })
  users: Users;
}
