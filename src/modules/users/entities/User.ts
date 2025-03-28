import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Person } from './Person';

@Entity('users', { schema: 'system' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Person, person => person.id)
  @JoinColumn({ name: 'person_id' })
  person: Person;

  @Column({ type: 'text' })
  username: string;

  @Column({ type: 'text' })
  password_hash: string;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  registro_fecha: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  actualizacion_fecha: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  eliminacion_fecha: Date;

  @Column({ type: 'boolean', default: true })
  estado: boolean;
}
