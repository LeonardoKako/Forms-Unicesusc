import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
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
      {
        id: 'administrativo',
        name: 'Administrativo',
        email: 'apoio03.ti@unicesusc.edu.br',
      },
      {
        id: 'financeiro',
        name: 'Financeiro',
        email: 'apoio03.ti@unicesusc.edu.br',
      },
      { id: 'nap', name: 'Nap', email: 'apoio03.ti@unicesusc.edu.br' },
      {
        id: 'secretaria_academica',
        name: 'Secretaria Acadêmica',
        email: 'apoio03.ti@unicesusc.edu.br',
      },
      {
        id: 'comercial',
        name: 'Comercial',
        email: 'apoio03.ti@unicesusc.edu.br',
      },
      {
        id: 'manutencao',
        name: 'Manutenção',
        email: 'apoio03.ti@unicesusc.edu.br',
      },
      { id: 'ti', name: 'TI', email: 'apoio03.ti@unicesusc.edu.br' },
      {
        id: 'reitoria',
        name: 'Reitoria',
        email: 'apoio03.ti@unicesusc.edu.br',
      },
      { id: 'nead', name: 'Nead', email: 'apoio03.ti@unicesusc.edu.br' },
      {
        id: 'biblioteca',
        name: 'Biblioteca',
        email: 'apoio03.ti@unicesusc.edu.br',
      },
      {
        id: 'marketing',
        name: 'Marketing',
        email: 'apoio03.ti@unicesusc.edu.br',
      },
      {
        id: 'pro_comunidade',
        name: 'Pró Comunidade',
        email: 'apoio03.ti@unicesusc.edu.br',
      },
      {
        id: 'recursos_humanos',
        name: 'Recursos Humanos',
        email: 'apoio03.ti@unicesusc.edu.br',
      },
      { id: 'nad', name: 'Nad', email: 'apoio03.ti@unicesusc.edu.br' },
      {
        id: 'central_atendimento',
        name: 'Central de Atendimento',
        email: 'apoio03.ti@unicesusc.edu.br',
      },
      { id: 'bolsas', name: 'Bolsas', email: 'apoio03.ti@unicesusc.edu.br' },
      {
        id: 'pos_graduacao',
        name: 'Pós-graduação',
        email: 'apoio03.ti@unicesusc.edu.br',
      },
      {
        id: 'colegio_cruz_sousa',
        name: 'Colégio Cruz e Sousa',
        email: 'apoio03.ti@unicesusc.edu.br',
      },
    ];

    for (const team of supportTeams) {
      await this.supportTeam.upsert({
        where: { id: team.id },
        update: { name: team.name, email: team.email },
        create: { id: team.id, name: team.name, email: team.email },
      });
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    await this.pool.end();
  }
}
