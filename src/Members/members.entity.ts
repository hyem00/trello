import { BaseEntity, RelationId, Column, Entity, OneToMany, Unique, ManyToOne, PrimaryColumn, CreateDateColumn, JoinColumn, UpdateDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { Boards } from '../Boards/boards.entity';
import { Users } from '../Users/users.entity';
import { CardManagers } from 'src/CardManager/card-manager.entity';

@Entity({ name: 'members' })
@Unique(['uid', 'bid']) // uid와 bid를 복합 유니크 키로 지정
export class Members {
  @PrimaryColumn()
  uid: number;

  @PrimaryColumn()
  bid: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Members-Users : N:1 관계
  @ManyToOne(() => Users, (users) => users.members)
  @JoinColumn({ name: 'uid' })
  users: Users;

  // Members-Boards : N:1 관계
  @ManyToOne(() => Boards, (boards) => boards.members)
  @JoinColumn({ name: 'bid' })
  boards: Boards;
}
