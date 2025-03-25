import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

@Entity('parameters', { schema: 'public' })
export class Parameter {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  parametro_clave: string;

  @Column({ type: 'text' })
  parametro_valor: string;

  @Column({ type: 'text' })
  parametro_nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  registro_fecha: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  actualizacion_fecha: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  eliminacion_fecha: Date;

  @Column({ type: 'boolean', default: true })
  estado: boolean;
}
