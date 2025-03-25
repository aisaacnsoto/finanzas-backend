import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

@Entity('persons', { schema: 'system' })
export class Person {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  first_name: string;

  @Column({ type: 'text' })
  last_name: string;

  @Column({ type: 'text' })
  email: string;

  @Column({ type: 'text', unique: true })
  phone_number: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  registro_fecha: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  actualizacion_fecha: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  eliminacion_fecha: Date;

  @Column({ type: 'boolean', default: true })
  estado: boolean;
}
