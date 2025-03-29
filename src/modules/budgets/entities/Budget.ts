import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn
} from 'typeorm';
import { Category } from '../../categories/entities/Category';

@Entity('budgets', { schema: 'public' })
export class Budget {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Category, category => category.id)
    @JoinColumn({ name: 'categoria_id' })
    category: Category;
  
    @Column('decimal', { precision: 15, scale: 2 })
    amount: number;

    @Column('date')
    periodo_inicio: Date;

    @Column('date')
    periodo_fin: Date;

    @Column('text', { nullable: true })
    descripcion: string;

    @Column({type: 'integer'})
    user_id: number;
  
    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    registro_fecha: Date;

    @UpdateDateColumn({ type: 'timestamp', nullable: true })
    actualizacion_fecha: Date;

    @DeleteDateColumn({ type: 'timestamp', nullable: true })
    eliminacion_fecha: Date;

    @Column('boolean', { default: true })
    estado: boolean;
}
