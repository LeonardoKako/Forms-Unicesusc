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
    testEmail = 'formulario.eventos@unicesusc.edu.br';
    async seedSupportTeams() {
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
};
exports.PrismaService = PrismaService;
exports.PrismaService = PrismaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], PrismaService);
//# sourceMappingURL=prisma.service.js.map