import { BaseEntity, CreateDateColumn, UpdateDateColumn, JoinColumn, ManyToOne, Column, Entity, Unique, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { Members } from '../Members/members.entity';
import { Users } from '../Users/users.entity';
import { Lists } from '../Lists/lists.entity';

@Entity()
@Unique(['bid']) // boardId 고유값 지정
export class Boards extends BaseEntity {
  @PrimaryGeneratedColumn()
  bid: number;

  // Boards-Users : N:1 관계
  @ManyToOne(() => Users, (users) => users.boards)
  @JoinColumn({ name: 'uid' })
  users: Users;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  color: string;

  @Column({ type: 'varchar' })
  explanation: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // 관계설정 따로 수정해주셔야 합니다.
  // // Boards-Members : 1:N 관계
  // @OneToMany(type => Members, board => Members.board, {eager: true})
  // members: Members

  // // Boards-Lists : 1:N 관계
  // @OneToMany(type => Lists, lists => Lists.board, {eager: true})
  // lists: Lists[]
}
