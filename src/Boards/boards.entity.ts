import { BaseEntity, CreateDateColumn, UpdateDateColumn, JoinColumn, ManyToOne, Column, Entity, Unique, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, RelationId } from 'typeorm';
import { Members } from '../Members/members.entity';
import { Users } from '../Users/users.entity';
import { Lists } from '../Lists/lists.entity';

@Entity()
@Unique(['bid']) // boardId 고유값 지정
export class Boards extends BaseEntity {
  @PrimaryGeneratedColumn()
  bid: number;

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

  // // Boards-Members : 1:N 관계
  @OneToMany(() => Members, (members) => members.boards)
  members: Members;

  // { nullable: true }
  // Boards-Users : N:1 관계
  @ManyToOne(() => Users, (users) => users.boards)
  @JoinColumn({ name: 'uid' })
  users: Users;

  
  // // Boards-Lists : 1:N 관계

  @OneToMany(() => Lists, (lists) => lists.boards)
  lists: Lists;

}
