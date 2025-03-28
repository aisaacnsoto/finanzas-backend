import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

@Entity('accounts', { schema: 'public' })
export class Account {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  nombre: string;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0.00 })
  saldo: number;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({type: 'integer'})
  user_id: number;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  registro_fecha: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  actualizacion_fecha: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  eliminacion_fecha: Date;

  @Column({ type: 'boolean', default: true })
  estado: boolean;
}
