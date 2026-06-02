"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = require("pg");
let PrismaService = class PrismaService extends client_1.PrismaClient {
    pool;
    constructor() {
        const connectionString = process.env.DATABASE_URL;
        const pool = new pg_1.Pool({ connectionString });
        const adapter = new adapter_pg_1.PrismaPg(pool);
        super({ adapter });
        this.pool = pool;
    }
    async onModuleInit() {
        await this.$connect();
        await this.seedSupportTeams();
    }
    async seedSupportTeams() {
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
};
exports.PrismaService = PrismaService;
exports.PrismaService = PrismaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], PrismaService);
//# sourceMappingURL=prisma.service.js.map