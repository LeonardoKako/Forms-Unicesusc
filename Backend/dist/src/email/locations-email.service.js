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
exports.LocationsEmailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const resend_1 = require("resend");
let LocationsEmailService = class LocationsEmailService {
    configService;
    resend;
    fromEmail;
    locationVerifierEmail;
    adminEmail;
    frontendUrl;
    constructor(configService) {
        this.configService = configService;
        this.resend = new resend_1.Resend(this.configService.get('RESEND_API_KEY'));
        this.fromEmail =
            this.configService.get('MAIL_FROM') || 'onboarding@resend.dev';
        this.locationVerifierEmail =
            this.configService.get('LOCATIONS_VERIFIER_EMAIL') ||
                'formulario.eventos@unicesusc.edu.br';
        this.adminEmail =
            this.configService.get('LOCATIONS_ADMIN_EMAIL') ||
                'formulario.eventos@unicesusc.edu.br';
        this.frontendUrl =
            this.configService.get('FRONTEND_URL') || 'http://localhost:3000';
    }
    async sendLocationAuthorVerification(location, token) {
        const verifyUrl = `${this.frontendUrl}/verificar-locacao?token=${token}`;
        const eventDateFormatted = new Date(location.eventDate).toLocaleDateString('pt-BR');
        await this.resend.emails.send({
            from: this.fromEmail,
            to: this.locationVerifierEmail,
            subject: `🔑 Validar Solicitação de Locação: ${location.controlCode}`,
            html: `
        <div style="font-family: 'Inter', system-ui, -apple-system, sans-serif; background-color: #faf7f8; padding: 40px 20px; margin: 0; min-height: 100%;">
          <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(92, 34, 53, 0.05); border: 1px solid #ebd9df;">
            <div style="background: linear-gradient(135deg, #5c2235, #c22a22); padding: 32px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase;">🔑 Validar Locação</h1>
              <p style="color: rgba(255, 255, 255, 0.8); margin: 6px 0 0 0; font-size: 13px; font-weight: 500; tracking: 1px;">UNICESUSC — SISTEMA DE RESERVAS</p>
            </div>
            
            <div style="padding: 32px; background-color: #ffffff;">
              <p style="font-size: 15px; color: #5c2235; font-weight: 700; margin-top: 0;">Olá!</p>
              <p style="font-size: 14px; color: #4a4a4a; line-height: 1.6; margin-bottom: 20px;">Uma nova solicitação de <strong>Locação Externa</strong> foi realizada. Como se trata de um parceiro externo, valide a solicitação para que ela possa seguir para a aprovação final do setor de eventos.</p>
              
              <div style="background: #faf7f8; border-radius: 12px; padding: 20px; border: 1px solid #ebd9df; margin: 24px 0;">
                <h3 style="margin-top: 0; margin-bottom: 12px; font-size: 12px; color: #5c2235; text-transform: uppercase; letter-spacing: 1px; font-weight: 800;">Detalhes da Solicitação</h3>
                <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #4a4a4a;">
                  <tr>
                    <td style="padding: 6px 0; color: #888888; font-weight: 500; width: 110px;">Código:</td>
                    <td style="padding: 6px 0; color: #5c2235; font-weight: 700;">${location.controlCode}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #888888; font-weight: 500;">Solicitante:</td>
                    <td style="padding: 6px 0; color: #2d2d2d; font-weight: 600;">${location.requesterName} (${location.requesterEmail})</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #888888; font-weight: 500;">Data:</td>
                    <td style="padding: 6px 0; color: #2d2d2d; font-weight: 600;">${eventDateFormatted}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #888888; font-weight: 500;">Horário:</td>
                    <td style="padding: 6px 0; color: #2d2d2d; font-weight: 600;">${location.startTime} às ${location.endTime}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #888888; font-weight: 500;">Espaço:</td>
                    <td style="padding: 6px 0; color: #2d2d2d; font-weight: 600;">${location.selectedRoom}</td>
                  </tr>
                </table>
              </div>

              <div style="text-align: center; margin: 32px 0;">
                <a href="${verifyUrl}" 
                   style="background: linear-gradient(135deg, #5c2235, #c22a22); color: #ffffff; padding: 14px 32px; border-radius: 10px; text-decoration: none; font-weight: 700; font-size: 14px; display: inline-block; box-shadow: 0 4px 10px rgba(59, 130, 246, 0.15);">
                  ✅ Confirmar e Enviar para Análise
                </a>
              </div>

              <div style="background: #fffbeb; border: 1px solid #fef3c7; border-radius: 10px; padding: 12px; text-align: center; margin-top: 24px;">
                <p style="font-size: 12px; color: #b45309; margin: 0; font-weight: 500;">
                  ⏰ Este link expira em <strong>30 minutos</strong>. Após esse prazo, a solicitação será cancelada automaticamente.
                </p>
              </div>
              
              <hr style="border: 0; border-top: 1px solid #ebd9df; margin: 24px 0;" />
              <p style="font-size: 11px; color: #a1a1a1; text-align: center; margin: 0;">E-mail automático enviado pelo sistema de reservas Unicesusc.</p>
            </div>
          </div>
        </div>
      `,
        });
    }
    async sendLocationAdminApproval(location, token) {
        const reviewUrl = `${this.frontendUrl}/revisar-locacao?token=${token}`;
        const eventDateFormatted = new Date(location.eventDate).toLocaleDateString('pt-BR');
        await this.resend.emails.send({
            from: this.fromEmail,
            to: this.adminEmail,
            subject: `📝 Revisão de Locação Externa: ${location.controlCode}`,
            html: `
        <div style="font-family: 'Inter', system-ui, -apple-system, sans-serif; background-color: #faf7f8; padding: 40px 20px; margin: 0; min-height: 100%;">
          <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(92, 34, 53, 0.05); border: 1px solid #ebd9df;">
            <div style="background: linear-gradient(135deg, #5c2235, #c22a22); padding: 32px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase;">📝 Aprovar Locação</h1>
              <p style="color: rgba(255, 255, 255, 0.8); margin: 6px 0 0 0; font-size: 13px; font-weight: 500; tracking: 1px;">PAINEL DO ADMINISTRADOR</p>
            </div>
            
            <div style="padding: 32px; background-color: #ffffff;">
              <p style="font-size: 15px; color: #5c2235; font-weight: 700; margin-top: 0;">Olá!</p>
              <p style="font-size: 14px; color: #4a4a4a; line-height: 1.6; margin-bottom: 20px;">Uma nova solicitação de locação externa foi validada na etapa inicial e está **aguardando sua decisão de aprovação final**.</p>
              
              <div style="background: #faf7f8; border-radius: 12px; padding: 20px; border: 1px solid #ebd9df; margin: 24px 0;">
                <h3 style="margin-top: 0; margin-bottom: 12px; font-size: 12px; color: #5c2235; text-transform: uppercase; letter-spacing: 1px; font-weight: 800;">Dados do Agendamento</h3>
                <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #4a4a4a;">
                  <tr>
                    <td style="padding: 6px 0; color: #888888; font-weight: 500; width: 110px;">Código:</td>
                    <td style="padding: 6px 0; color: #5c2235; font-weight: 700;">${location.controlCode}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #888888; font-weight: 500;">Solicitante:</td>
                    <td style="padding: 6px 0; color: #2d2d2d; font-weight: 600;">${location.requesterName} (${location.requesterEmail})</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #888888; font-weight: 500;">Data:</td>
                    <td style="padding: 6px 0; color: #2d2d2d; font-weight: 600;">${eventDateFormatted}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #888888; font-weight: 500;">Horário:</td>
                    <td style="padding: 6px 0; color: #2d2d2d; font-weight: 600;">${location.startTime} às ${location.endTime}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #888888; font-weight: 500;">Espaço:</td>
                    <td style="padding: 6px 0; color: #2d2d2d; font-weight: 600;">${location.selectedRoom}</td>
                  </tr>
                </table>
              </div>

              <div style="text-align: center; margin: 32px 0;">
                <a href="${reviewUrl}" 
                   style="background: linear-gradient(135deg, #5c2235, #c22a22); color: #ffffff; padding: 14px 32px; border-radius: 10px; text-decoration: none; font-weight: 700; font-size: 14px; display: inline-block; box-shadow: 0 4px 10px rgba(59, 130, 246, 0.15);">
                  📋 Analisar e Decidir
                </a>
              </div>

              <div style="background: #faf7f8; border-radius: 10px; padding: 12px; text-align: center; margin-top: 24px; border: 1px solid #ebd9df;">
                <p style="font-size: 11px; color: #666666; margin: 0;">
                  ⏰ Este link expira em <strong>7 dias</strong>.
                </p>
              </div>
              
              <hr style="border: 0; border-top: 1px solid #ebd9df; margin: 24px 0;" />
              <p style="font-size: 11px; color: #a1a1a1; text-align: center; margin: 0;">E-mail automático enviado pelo sistema de reservas Unicesusc.</p>
            </div>
          </div>
        </div>
      `,
        });
    }
    async sendLocationApprovalNotification(location) {
        const eventDateFormatted = new Date(location.eventDate).toLocaleDateString('pt-BR');
        await this.resend.emails.send({
            from: this.fromEmail,
            to: this.locationVerifierEmail,
            subject: `✅ Reserva Confirmada: Locação Externa — ${location.controlCode}`,
            html: `
        <div style="font-family: 'Inter', system-ui, -apple-system, sans-serif; background-color: #faf7f8; padding: 40px 20px; margin: 0; min-height: 100%;">
          <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(92, 34, 53, 0.05); border: 1px solid #ebd9df;">
            <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 32px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase;">✅ Locação Aprovada!</h1>
              <p style="color: rgba(255, 255, 255, 0.9); margin: 6px 0 0 0; font-size: 13px; font-weight: 500; tracking: 1px;">SUA RESERVA ESTÁ CONFIRMADA</p>
            </div>
            
            <div style="padding: 32px; background-color: #ffffff;">
              <p style="font-size: 16px; color: #059669; font-weight: 700; margin-top: 0;">Olá, ${location.requesterName}!</p>
              <p style="font-size: 14px; color: #4a4a4a; line-height: 1.6; margin-bottom: 20px;">Temos o prazer de informar que a sua solicitação de <strong>Locação Externa</strong> foi **aprovada** com sucesso e o espaço está garantido para a data programada.</p>
              
              <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 20px; margin: 24px 0;">
                <h3 style="margin-top: 0; margin-bottom: 12px; font-size: 12px; color: #047857; text-transform: uppercase; letter-spacing: 1px; font-weight: 800;">Dados da Confirmação</h3>
                <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #374151;">
                  <tr>
                    <td style="padding: 6px 0; color: #64748b; font-weight: 500; width: 110px;">Código:</td>
                    <td style="padding: 6px 0; color: #047857; font-weight: 700;">${location.controlCode}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #64748b; font-weight: 500;">Espaço:</td>
                    <td style="padding: 6px 0; color: #0f172a; font-weight: 600;">${location.selectedRoom}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #64748b; font-weight: 500;">Data:</td>
                    <td style="padding: 6px 0; color: #0f172a; font-weight: 600;">${eventDateFormatted}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #64748b; font-weight: 500;">Horário:</td>
                    <td style="padding: 6px 0; color: #0f172a; font-weight: 600;">${location.startTime} às ${location.endTime}</td>
                  </tr>
                </table>
              </div>
              
              <p style="font-size: 13px; color: #475569; line-height: 1.6;">As equipes de apoio interno já foram notificadas e estarão preparadas no dia programado.</p>
              
              <hr style="border: 0; border-top: 1px solid #ebd9df; margin: 24px 0;" />
              <p style="font-size: 11px; color: #a1a1a1; text-align: center; margin: 0;">E-mail automático enviado pelo sistema de reservas Unicesusc.</p>
            </div>
          </div>
        </div>
      `,
        });
    }
    async sendLocationRejectionNotification(location, reason) {
        const eventDateFormatted = new Date(location.eventDate).toLocaleDateString('pt-BR');
        await this.resend.emails.send({
            from: this.fromEmail,
            to: this.locationVerifierEmail,
            subject: `❌ Reserva Não Aprovada: Locação Externa — ${location.controlCode}`,
            html: `
        <div style="font-family: 'Inter', system-ui, -apple-system, sans-serif; background-color: #faf7f8; padding: 40px 20px; margin: 0; min-height: 100%;">
          <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(92, 34, 53, 0.05); border: 1px solid #ebd9df;">
            <div style="background: linear-gradient(135deg, #ef4444, #b91c1c); padding: 32px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase;">❌ Locação Não Aprovada</h1>
              <p style="color: rgba(255, 255, 255, 0.9); margin: 6px 0 0 0; font-size: 13px; font-weight: 500; tracking: 1px;">UNICESUSC — NOTIFICAÇÃO</p>
            </div>
            
            <div style="padding: 32px; background-color: #ffffff;">
              <p style="font-size: 16px; color: #b91c1c; font-weight: 700; margin-top: 0;">Olá, ${location.requesterName}.</p>
              <p style="font-size: 14px; color: #4a4a4a; line-height: 1.6; margin-bottom: 20px;">Infelizmente, sua solicitação de locação de espaço **não foi aprovada** pelo comitê interno.</p>
              
              ${reason
                ? `
              <div style="background: #fffbeb; border: 1px solid #fef08a; border-radius: 12px; padding: 18px; margin: 24px 0; color: #854d0e; font-size: 14px; line-height: 1.6;">
                <strong style="color: #a16207; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 6px;">Motivo do Indeferimento:</strong>
                ${reason}
              </div>
              `
                : ''}

              <div style="background: #faf7f8; border-radius: 12px; padding: 20px; border: 1px solid #ebd9df; margin: 24px 0;">
                <h3 style="margin-top: 0; margin-bottom: 12px; font-size: 12px; color: #666666; text-transform: uppercase; letter-spacing: 1px; font-weight: 800;">Dados da Solicitação</h3>
                <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #4a4a4a;">
                  <tr>
                    <td style="padding: 6px 0; color: #888888; font-weight: 500; width: 100px;">Código:</td>
                    <td style="padding: 6px 0; color: #5c2235; font-weight: 700;">${location.controlCode}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #888888; font-weight: 500;">Espaço:</td>
                    <td style="padding: 6px 0; color: #2d2d2d; font-weight: 600;">${location.selectedRoom}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #888888; font-weight: 500;">Data:</td>
                    <td style="padding: 6px 0; color: #2d2d2d; font-weight: 600;">${eventDateFormatted}</td>
                  </tr>
                </table>
              </div>

              <p style="font-size: 13px; color: #666666; line-height: 1.6; margin-bottom: 0;">Para qualquer dúvida ou contato, fale conosco através de: <strong style="color: #5c2235;">formulario.eventos@unicesusc.edu.br</strong>.</p>
              
              <hr style="border: 0; border-top: 1px solid #ebd9df; margin: 24px 0;" />
              <p style="font-size: 11px; color: #a1a1a1; text-align: center; margin: 0;">E-mail automático enviado pelo sistema de reservas Unicesusc.</p>
            </div>
          </div>
        </div>
      `,
        });
    }
    async sendLocationSupportTeamsNotification(location, teams) {
        const emails = Array.from(new Set(teams.map((t) => t.email).filter(Boolean)));
        if (emails.length === 0)
            return;
        const eventDateFormatted = new Date(location.eventDate).toLocaleDateString('pt-BR');
        const teamNames = teams.map((t) => t.name).join(', ');
        const formUrl = `${this.frontendUrl}/location/${location.id}`;
        await this.resend.emails.send({
            from: this.fromEmail,
            to: emails,
            subject: `🔔 Equipes de Apoio Convocadas (Locação): ${location.controlCode}`,
            html: `
        <div style="font-family: 'Inter', system-ui, -apple-system, sans-serif; background-color: #faf7f8; padding: 40px 20px; margin: 0; min-height: 100%;">
          <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(92, 34, 53, 0.05); border: 1px solid #ebd9df;">
            <div style="background: linear-gradient(135deg, #5c2235, #c22a22); padding: 32px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase;">🔔 Apoio Locação</h1>
              <p style="color: rgba(255, 255, 255, 0.8); margin: 6px 0 0 0; font-size: 13px; font-weight: 500; tracking: 1px;">EQUIPES: ${teamNames.toUpperCase()}</p>
            </div>
            
            <div style="padding: 32px; background-color: #ffffff;">
              <p style="font-size: 15px; color: #4a4a4a; line-height: 1.6; margin-top: 0; margin-bottom: 20px;">Olá! Uma nova locação externa foi confirmada e **requer o suporte operacional** das equipes: <strong>${teamNames}</strong>.</p>
              
              <div style="background: #faf7f8; border-radius: 12px; padding: 20px; border: 1px solid #ebd9df; margin: 24px 0;">
                <h3 style="margin-top: 0; margin-bottom: 12px; font-size: 12px; color: #5c2235; text-transform: uppercase; letter-spacing: 1px; font-weight: 800;">Dados de Agendamento</h3>
                <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #4a4a4a;">
                  <tr>
                    <td style="padding: 6px 0; color: #888888; font-weight: 500; width: 110px;">Código:</td>
                    <td style="padding: 6px 0; color: #5c2235; font-weight: 700;">${location.controlCode}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #888888; font-weight: 500;">Solicitante:</td>
                    <td style="padding: 6px 0; color: #2d2d2d; font-weight: 600;">${location.requesterName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #888888; font-weight: 500;">Data:</td>
                    <td style="padding: 6px 0; color: #2d2d2d; font-weight: 600;">${eventDateFormatted}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #888888; font-weight: 500;">Horário:</td>
                    <td style="padding: 6px 0; color: #2d2d2d; font-weight: 600;">${location.startTime} às ${location.endTime}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #888888; font-weight: 500;">Espaço:</td>
                    <td style="padding: 6px 0; color: #2d2d2d; font-weight: 600;">${location.selectedRoom}</td>
                  </tr>
                </table>
              </div>

              <div style="text-align: center; margin: 30px 0;">
                <a href="${formUrl}" 
                   style="background: linear-gradient(135deg, #5c2235, #c22a22); color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 15px; display: inline-block;">
                  📋 Visualizar Detalhes do Formulário
                </a>
              </div>
              
              <hr style="border: 0; border-top: 1px solid #ebd9df; margin: 24px 0;" />
              <p style="font-size: 11px; color: #a1a1a1; text-align: center; margin: 0;">E-mail automático enviado pelo sistema de reservas Unicesusc.</p>
            </div>
          </div>
        </div>
      `,
        });
    }
};
exports.LocationsEmailService = LocationsEmailService;
exports.LocationsEmailService = LocationsEmailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], LocationsEmailService);
//# sourceMappingURL=locations-email.service.js.map