import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { Account } from '../../accounts/entities/Account';
import { Category } from '../../categories/entities/Category';

@Entity('transactions', { schema: 'public' })
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Account, account => account.id)
  @JoinColumn({ name: 'cuenta_id' })
  account: Account;

  @ManyToOne(() => Category, category => category.id)
  @JoinColumn({ name: 'categoria_id' })
  category: Category;

  @Column({type: 'integer'})
  tipo_transaccion_id: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  monto: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha: Date;

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
