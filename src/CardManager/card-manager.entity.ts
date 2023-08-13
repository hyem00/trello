import { BaseEntity, RelationId, Column, Entity, Unique, ManyToOne, PrimaryColumn, CreateDateColumn, JoinColumn, UpdateDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { Members } from 'src/Members/members.entity';
import { Cards } from 'src/Cards/cards.entity';
import { Users } from 'src/Users/users.entity';

@Entity({ name: 'cardMangers' })
@Unique(['cid', 'uid']) // cid와 uid를 복합 유니크 키로 지정
export class CardManagers {
  @PrimaryColumn()
  cid: number;

  @PrimaryColumn()
  uid: number;

  // CardManagers-Users : N:1 관계
  @ManyToOne(() => Users, (users) => users.cardManagers)
  @JoinColumn({ name: 'uid' })
  users: Users;

  // CardManagers-Cards : N:1 관계
  @ManyToOne(() => Cards, (cards) => cards.cardManagers)
  @JoinColumn({ name: 'cid' })
  cards: Cards;
}
