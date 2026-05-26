import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private pool: Pool;

  constructor() {
    const connectionString = process.env.DATABASE_URL;
    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    super({ adapter });
    this.pool = pool;
  }

  async onModuleInit() {
    await this.$connect();
    await this.seedSupportTeams();
  }

  private async seedSupportTeams() {
    const supportTeams = [
      { id: 'administrativo', name: 'Administrativo' },
      { id: 'financeiro', name: 'Financeiro' },
      { id: 'nap', name: 'Nap' },
      { id: 'secretaria_academica', name: 'Secretaria Acadêmica' },
      { id: 'comercial', name: 'Comercial' },
      { id: 'manutencao', name: 'Manutenção' },
      { id: 'ti', name: 'TI' },
      { id: 'reitoria', name: 'Reitoria' },
      { id: 'nead', name: 'Nead' },
      { id: 'biblioteca', name: 'Biblioteca' },
      { id: 'marketing', name: 'Marketing' },
      { id: 'pro_comunidade', name: 'Pró Comunidade' },
      { id: 'recursos_humanos', name: 'Recursos Humanos' },
      { id: 'nad', name: 'Nad' },
      { id: 'central_atendimento', name: 'Central de Atendimento' },
      { id: 'bolsas', name: 'Bolsas' },
      { id: 'pos_graduacao', name: 'Pós-graduação' },
      { id: 'colegio_cruz_sousa', name: 'Colégio Cruz e Sousa' },
    ];

    for (const team of supportTeams) {
      await this.supportTeam.upsert({
        where: { id: team.id },
        update: { name: team.name },
        create: { id: team.id, name: team.name },
      });
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    await this.pool.end();
  }
}
