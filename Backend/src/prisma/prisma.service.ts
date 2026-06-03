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

  testEmail = 'formulario.eventos@unicesusc.edu.br';

  private async seedSupportTeams() {
    const supportTeams = [
      {
        id: 'administrativo',
        name: 'Administrativo',
        email: this.testEmail,
      },
      {
        id: 'financeiro',
        name: 'Financeiro',
        email: this.testEmail,
      },
      { id: 'nap', name: 'Nap', email: this.testEmail },
      {
        id: 'secretaria_academica',
        name: 'Secretaria Acadêmica',
        email: this.testEmail,
      },
      {
        id: 'comercial',
        name: 'Comercial',
        email: this.testEmail,
      },
      {
        id: 'manutencao',
        name: 'Manutenção',
        email: this.testEmail,
      },
      { id: 'ti', name: 'TI', email: this.testEmail },
      {
        id: 'reitoria',
        name: 'Reitoria',
        email: this.testEmail,
      },
      { id: 'nead', name: 'Nead', email: this.testEmail },
      {
        id: 'biblioteca',
        name: 'Biblioteca',
        email: this.testEmail,
      },
      {
        id: 'marketing',
        name: 'Marketing',
        email: this.testEmail,
      },
      {
        id: 'pro_comunidade',
        name: 'Pró Comunidade',
        email: this.testEmail,
      },
      {
        id: 'recursos_humanos',
        name: 'Recursos Humanos',
        email: this.testEmail,
      },
      { id: 'nad', name: 'Nad', email: this.testEmail },
      {
        id: 'central_atendimento',
        name: 'Central de Atendimento',
        email: this.testEmail,
      },
      { id: 'bolsas', name: 'Bolsas', email: this.testEmail },
      {
        id: 'pos_graduacao',
        name: 'Pós-graduação',
        email: this.testEmail,
      },
      {
        id: 'colegio_cruz_sousa',
        name: 'Colégio Cruz e Sousa',
        email: this.testEmail,
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
