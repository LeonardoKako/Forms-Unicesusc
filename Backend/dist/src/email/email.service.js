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
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const resend_1 = require("resend");
let EmailService = class EmailService {
    configService;
    resend;
    fromEmail = 'onboarding@resend.dev';
    frontendUrl;
    constructor(configService) {
        this.configService = configService;
        this.resend = new resend_1.Resend(this.configService.get('RESEND_API_KEY'));
        this.frontendUrl =
            this.configService.get('FRONTEND_URL') || 'http://localhost:3000';
    }
    async sendAuthorVerification(event, token) {
        const verifyUrl = `${this.frontendUrl}/verificar-evento?token=${token}`;
        const eventDateFormatted = new Date(event.eventDate).toLocaleDateString('pt-BR');
        await this.resend.emails.send({
            from: this.fromEmail,
            to: event.requesterEmail,
            subject: `🔑 Confirme seu evento: ${event.eventTitle} — ${event.controlCode}`,
            html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
          <div style="background: linear-gradient(135deg, #1a56db, #7c3aed); padding: 30px; border-radius: 12px 12px 0 0;">
            <h1 style="color: #ffffff; margin: 0; font-size: 22px;">📋 Confirmação de Evento</h1>
            <p style="color: #e0e7ff; margin: 8px 0 0 0; font-size: 14px;">Unicesusc — Sistema de Reservas</p>
          </div>
          
          <div style="padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
            <p style="font-size: 16px; color: #374151;">Olá, <strong>${event.requesterName}</strong>!</p>
            <p style="font-size: 14px; color: #6b7280;">Recebemos sua solicitação de evento. Para prosseguir, confirme clicando no botão abaixo:</p>
            
            <div style="background: #f9fafb; border-radius: 8px; padding: 16px; margin: 20px 0;">
              <table style="width: 100%; font-size: 14px; color: #374151;">
                <tr><td style="padding: 4px 0;"><strong>Código:</strong></td><td>${event.controlCode}</td></tr>
                <tr><td style="padding: 4px 0;"><strong>Evento:</strong></td><td>${event.eventTitle}</td></tr>
                <tr><td style="padding: 4px 0;"><strong>Data:</strong></td><td>${eventDateFormatted}</td></tr>
                <tr><td style="padding: 4px 0;"><strong>Horário:</strong></td><td>${event.startTime} — ${event.endTime}</td></tr>
                <tr><td style="padding: 4px 0;"><strong>Local:</strong></td><td>${event.selectedRoom}</td></tr>
              </table>
            </div>

            <div style="text-align: center; margin: 28px 0;">
              <a href="${verifyUrl}" 
                 style="background: linear-gradient(135deg, #1a56db, #7c3aed); color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 15px; display: inline-block;">
                ✅ Confirmar Meu Evento
              </a>
            </div>

            <p style="font-size: 12px; color: #9ca3af; text-align: center;">
              ⏰ Este link expira em <strong>30 minutos</strong>. Após esse prazo, o evento será cancelado automaticamente.
            </p>
            
            <hr style="border: 1px solid #e5e7eb; margin: 20px 0;" />
            <p style="font-size: 11px; color: #9ca3af;">Se você não solicitou este evento, ignore este email.</p>
          </div>
        </div>
      `,
        });
    }
    async sendAdminApproval(event, token) {
        const reviewUrl = `${this.frontendUrl}/revisar-evento?token=${token}`;
        const eventDateFormatted = new Date(event.eventDate).toLocaleDateString('pt-BR');
        await this.resend.emails.send({
            from: this.fromEmail,
            to: 'formulario.eventos@unicesusc.edu.br',
            subject: `📝 Novo evento para aprovação: ${event.eventTitle} — ${event.controlCode}`,
            html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
          <div style="background: linear-gradient(135deg, #d97706, #ea580c); padding: 30px; border-radius: 12px 12px 0 0;">
            <h1 style="color: #ffffff; margin: 0; font-size: 22px;">📝 Evento Aguardando Aprovação</h1>
            <p style="color: #fef3c7; margin: 8px 0 0 0; font-size: 14px;">Unicesusc — Sistema de Reservas</p>
          </div>
          
          <div style="padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
            <p style="font-size: 16px; color: #374151;">Um novo evento foi confirmado pelo autor e aguarda sua aprovação.</p>
            
            <div style="background: #f9fafb; border-radius: 8px; padding: 16px; margin: 20px 0;">
              <table style="width: 100%; font-size: 14px; color: #374151;">
                <tr><td style="padding: 4px 0;"><strong>Código:</strong></td><td>${event.controlCode}</td></tr>
                <tr><td style="padding: 4px 0;"><strong>Evento:</strong></td><td>${event.eventTitle}</td></tr>
                <tr><td style="padding: 4px 0;"><strong>Solicitante:</strong></td><td>${event.requesterName} (${event.requesterEmail})</td></tr>
                <tr><td style="padding: 4px 0;"><strong>Data:</strong></td><td>${eventDateFormatted}</td></tr>
                <tr><td style="padding: 4px 0;"><strong>Horário:</strong></td><td>${event.startTime} — ${event.endTime}</td></tr>
                <tr><td style="padding: 4px 0;"><strong>Local:</strong></td><td>${event.selectedRoom}</td></tr>
              </table>
            </div>

            <div style="text-align: center; margin: 28px 0;">
              <a href="${reviewUrl}" 
                 style="background: linear-gradient(135deg, #d97706, #ea580c); color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 15px; display: inline-block;">
                📋 Revisar Evento
              </a>
            </div>

            <p style="font-size: 12px; color: #9ca3af; text-align: center;">
              ⏰ Este link expira em <strong>7 dias</strong>.
            </p>
            
            <hr style="border: 1px solid #e5e7eb; margin: 20px 0;" />
            <p style="font-size: 11px; color: #9ca3af;">Email enviado automaticamente pelo sistema de reservas Unicesusc.</p>
          </div>
        </div>
      `,
        });
    }
    async sendApprovalNotification(event) {
        const eventDateFormatted = new Date(event.eventDate).toLocaleDateString('pt-BR');
        await this.resend.emails.send({
            from: this.fromEmail,
            to: event.requesterEmail,
            subject: `✅ Evento aprovado: ${event.eventTitle} — ${event.controlCode}`,
            html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
          <div style="background: linear-gradient(135deg, #059669, #10b981); padding: 30px; border-radius: 12px 12px 0 0;">
            <h1 style="color: #ffffff; margin: 0; font-size: 22px;">✅ Evento Aprovado!</h1>
            <p style="color: #d1fae5; margin: 8px 0 0 0; font-size: 14px;">Unicesusc — Sistema de Reservas</p>
          </div>
          
          <div style="padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
            <p style="font-size: 16px; color: #374151;">Olá, <strong>${event.requesterName}</strong>!</p>
            <p style="font-size: 14px; color: #6b7280;">Seu evento foi <strong style="color: #059669;">aprovado</strong> pelo setor de eventos.</p>
            
            <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin: 20px 0;">
              <table style="width: 100%; font-size: 14px; color: #374151;">
                <tr><td style="padding: 4px 0;"><strong>Código:</strong></td><td>${event.controlCode}</td></tr>
                <tr><td style="padding: 4px 0;"><strong>Evento:</strong></td><td>${event.eventTitle}</td></tr>
                <tr><td style="padding: 4px 0;"><strong>Data:</strong></td><td>${eventDateFormatted}</td></tr>
                <tr><td style="padding: 4px 0;"><strong>Horário:</strong></td><td>${event.startTime} — ${event.endTime}</td></tr>
                <tr><td style="padding: 4px 0;"><strong>Local:</strong></td><td>${event.selectedRoom}</td></tr>
              </table>
            </div>

            <p style="font-size: 14px; color: #374151;">As equipes de apoio selecionadas foram notificadas e estarão prontas para o dia do evento.</p>
            
            <hr style="border: 1px solid #e5e7eb; margin: 20px 0;" />
            <p style="font-size: 11px; color: #9ca3af;">Email enviado automaticamente pelo sistema de reservas Unicesusc.</p>
          </div>
        </div>
      `,
        });
    }
    async sendRejectionNotification(event, reason) {
        const eventDateFormatted = new Date(event.eventDate).toLocaleDateString('pt-BR');
        await this.resend.emails.send({
            from: this.fromEmail,
            to: event.requesterEmail,
            subject: `❌ Evento não aprovado: ${event.eventTitle} — ${event.controlCode}`,
            html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
          <div style="background: linear-gradient(135deg, #dc2626, #ef4444); padding: 30px; border-radius: 12px 12px 0 0;">
            <h1 style="color: #ffffff; margin: 0; font-size: 22px;">❌ Evento Não Aprovado</h1>
            <p style="color: #fecaca; margin: 8px 0 0 0; font-size: 14px;">Unicesusc — Sistema de Reservas</p>
          </div>
          
          <div style="padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
            <p style="font-size: 16px; color: #374151;">Olá, <strong>${event.requesterName}</strong>.</p>
            <p style="font-size: 14px; color: #6b7280;">Infelizmente, seu evento <strong>não foi aprovado</strong> pelo setor de eventos.</p>
            
            ${reason
                ? `
            <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 16px; margin: 20px 0; color: #78350f; font-size: 14px;">
              <strong>Motivo da rejeição:</strong><br/>
              ${reason}
            </div>
            `
                : ''}

            <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 16px; margin: 20px 0;">
              <table style="width: 100%; font-size: 14px; color: #374151;">
                <tr><td style="padding: 4px 0;"><strong>Código:</strong></td><td>${event.controlCode}</td></tr>
                <tr><td style="padding: 4px 0;"><strong>Evento:</strong></td><td>${event.eventTitle}</td></tr>
                <tr><td style="padding: 4px 0;"><strong>Data:</strong></td><td>${eventDateFormatted}</td></tr>
              </table>
            </div>

            <p style="font-size: 14px; color: #374151;">Para mais informações ou dúvidas, entre em contato com o setor de eventos pelo email <strong>formulario.eventos@unicesusc.edu.br</strong>.</p>
            
            <hr style="border: 1px solid #e5e7eb; margin: 20px 0;" />
            <p style="font-size: 11px; color: #9ca3af;">Email enviado automaticamente pelo sistema de reservas Unicesusc.</p>
          </div>
        </div>
      `,
        });
    }
    async sendSupportTeamNotification(event, team) {
        if (!team.email)
            return;
        const eventDateFormatted = new Date(event.eventDate).toLocaleDateString('pt-BR');
        await this.resend.emails.send({
            from: this.fromEmail,
            to: team.email,
            subject: `🔔 Evento aprovado requer sua equipe: ${event.eventTitle} — ${event.controlCode}`,
            html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
          <div style="background: linear-gradient(135deg, #2563eb, #3b82f6); padding: 30px; border-radius: 12px 12px 0 0;">
            <h1 style="color: #ffffff; margin: 0; font-size: 22px;">🔔 Sua equipe foi acionada</h1>
            <p style="color: #bfdbfe; margin: 8px 0 0 0; font-size: 14px;">Equipe: ${team.name}</p>
          </div>
          
          <div style="padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
            <p style="font-size: 16px; color: #374151;">Um evento aprovado requer o apoio da equipe <strong>${team.name}</strong>.</p>
            
            <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 16px; margin: 20px 0;">
              <table style="width: 100%; font-size: 14px; color: #374151;">
                <tr><td style="padding: 4px 0;"><strong>Código:</strong></td><td>${event.controlCode}</td></tr>
                <tr><td style="padding: 4px 0;"><strong>Evento:</strong></td><td>${event.eventTitle}</td></tr>
                <tr><td style="padding: 4px 0;"><strong>Solicitante:</strong></td><td>${event.requesterName}</td></tr>
                <tr><td style="padding: 4px 0;"><strong>Data:</strong></td><td>${eventDateFormatted}</td></tr>
                <tr><td style="padding: 4px 0;"><strong>Horário:</strong></td><td>${event.startTime} — ${event.endTime}</td></tr>
                <tr><td style="padding: 4px 0;"><strong>Local:</strong></td><td>${event.selectedRoom}</td></tr>
              </table>
            </div>
            
            <hr style="border: 1px solid #e5e7eb; margin: 20px 0;" />
            <p style="font-size: 11px; color: #9ca3af;">Email enviado automaticamente pelo sistema de reservas Unicesusc.</p>
          </div>
        </div>
      `,
        });
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], EmailService);
//# sourceMappingURL=email.service.js.map