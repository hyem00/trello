import { ManyToOne, JoinColumn, BaseEntity, UpdateDateColumn, CreateDateColumn, Column, Entity, Unique, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { Comments } from '../Comments/comments.entity';
import { Lists } from '../Lists/lists.entity';
import { Users } from 'src/Users/users.entity';

@Entity()
@Unique(['cid']) // cardId 고유값 지정
export class Cards extends BaseEntity {
  @PrimaryGeneratedColumn()
  cid: number;

  @Column()
  lid: number;

  @Column()
  title: string;

  @Column()
  color: string;

  @Column()
  explanation: string;

  @Column()
  deadline: Date;

  @Column()
  position: number;

  @Column()
  manager: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Cards-Lists : N:1 관계
  @ManyToOne(() => Lists, (lists) => lists.cards)
  @JoinColumn({ name: 'lid' })
  lists: Lists[];

  // Cards-Comments : 1:N 관계
  @OneToMany(() => Comments, (comments) => comments.cards)
  comments: Comments[];

  // Card - User : N:1 관계
  @ManyToOne(() => Users, (users) => users.cards)
  @JoinColumn({ name: 'uid' })
  users: Users[];
}
