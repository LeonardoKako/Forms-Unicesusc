import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

interface EventEmailData {
  id: string;
  controlCode: string;
  requesterName: string;
  requesterEmail: string;
  eventTitle: string;
  eventDate: Date;
  startTime: string;
  endTime: string;
  selectedRoom: string;
}

interface SupportTeamData {
  id: string;
  name: string;
  email: string | null;
}

@Injectable()
export class EventsEmailService {
  private transporter: nodemailer.Transporter;
  private fromEmail: string;
  private adminEmail: string;
  private frontendUrl: string;

  constructor(private configService: ConfigService) {
    this.fromEmail =
      this.configService.get<string>('MAIL_FROM') || 'formulario.eventos@unicesusc.edu.br';
    this.adminEmail =
      this.configService.get<string>('EVENTS_ADMIN_EMAIL') ||
      'formulario.eventos@unicesusc.edu.br';
    this.frontendUrl =
      this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';

    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST') || 'smtp.gmail.com',
      port: this.configService.get<number>('SMTP_PORT') || 587,
      secure: false,
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASS'),
      },
    });
  }

  /**
   * Etapa 1: Email para o AUTOR confirmar o evento (JWT 30min)
   */
  async sendAuthorVerification(
    event: EventEmailData,
    token: string,
  ): Promise<void> {
    const verifyUrl = `${this.frontendUrl}/verificar-evento?token=${token}`;
    const eventDateFormatted = new Date(event.eventDate).toLocaleDateString(
      'pt-BR',
    );

    await this.transporter.sendMail({
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

  /**
   * Etapa 2: Email para o ADMIN aprovar/rejeitar o evento (JWT 7 dias)
   */
  async sendAdminApproval(
    event: EventEmailData,
    token: string,
  ): Promise<void> {
    const reviewUrl = `${this.frontendUrl}/revisar-evento?token=${token}`;
    const eventDateFormatted = new Date(event.eventDate).toLocaleDateString(
      'pt-BR',
    );

    await this.transporter.sendMail({
      from: this.fromEmail,
      to: this.adminEmail,
      subject: `📝 Novo evento para aprovação: ${event.eventTitle} — ${event.controlCode}`,
      html: `
        <div style="font-family: 'Inter', system-ui, -apple-system, sans-serif; background-color: #faf7f8; padding: 40px 20px; margin: 0; min-height: 100%;">
          <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(92, 34, 53, 0.05); border: 1px solid #ebd9df;">
            <div style="background: linear-gradient(135deg, #5c2235, #c22a22); padding: 32px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase;">📝 Evento para Aprovação</h1>
              <p style="color: rgba(255, 255, 255, 0.8); margin: 6px 0 0 0; font-size: 13px; font-weight: 500; tracking: 1px;">PAINEL DO ADMINISTRADOR</p>
            </div>
            
            <div style="padding: 32px; background-color: #ffffff;">
              <p style="font-size: 15px; color: #4a4a4a; line-height: 1.6; margin-top: 0; margin-bottom: 20px;">Um novo agendamento de espaço foi confirmado pelo autor e está <strong>aguardando revisão e aprovação</strong> do setor de eventos.</p>
              
              <div style="background: #faf7f8; border-radius: 12px; padding: 20px; border: 1px solid #ebd9df; margin: 24px 0;">
                <h3 style="margin-top: 0; margin-bottom: 12px; font-size: 12px; color: #5c2235; text-transform: uppercase; letter-spacing: 1px; font-weight: 800;">Detalhes da Solicitação</h3>
                <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #4a4a4a;">
                  <tr>
                    <td style="padding: 6px 0; color: #888888; font-weight: 500; width: 110px;">Código:</td>
                    <td style="padding: 6px 0; color: #5c2235; font-weight: 700;">${event.controlCode}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #888888; font-weight: 500;">Solicitante:</td>
                    <td style="padding: 6px 0; color: #2d2d2d; font-weight: 600;">${event.requesterName} (${event.requesterEmail})</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #888888; font-weight: 500;">Evento:</td>
                    <td style="padding: 6px 0; color: #2d2d2d; font-weight: 600;">${event.eventTitle}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #888888; font-weight: 500;">Data:</td>
                    <td style="padding: 6px 0; color: #2d2d2d; font-weight: 600;">${eventDateFormatted}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #888888; font-weight: 500;">Horário:</td>
                    <td style="padding: 6px 0; color: #2d2d2d; font-weight: 600;">${event.startTime} às ${event.endTime}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #888888; font-weight: 500;">Espaço:</td>
                    <td style="padding: 6px 0; color: #2d2d2d; font-weight: 600;">${event.selectedRoom}</td>
                  </tr>
                </table>
              </div>

              <div style="text-align: center; margin: 32px 0;">
                <a href="${reviewUrl}" 
                   style="background: linear-gradient(135deg, #5c2235, #c22a22); color: #ffffff; padding: 14px 32px; border-radius: 10px; text-decoration: none; font-weight: 700; font-size: 14px; display: inline-block; box-shadow: 0 4px 10px rgba(194, 42, 34, 0.15);">
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

  /**
   * Notifica o autor que o evento foi APROVADO
   */
  async sendApprovalNotification(event: EventEmailData): Promise<void> {
    const eventDateFormatted = new Date(event.eventDate).toLocaleDateString(
      'pt-BR',
    );

    await this.transporter.sendMail({
      from: this.fromEmail,
      to: event.requesterEmail,
      subject: `✅ Evento aprovado: ${event.eventTitle} — ${event.controlCode}`,
      html: `
        <div style="font-family: 'Inter', system-ui, -apple-system, sans-serif; background-color: #faf7f8; padding: 40px 20px; margin: 0; min-height: 100%;">
          <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(92, 34, 53, 0.05); border: 1px solid #ebd9df;">
            <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 32px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase;">✅ Evento Aprovado!</h1>
              <p style="color: rgba(255, 255, 255, 0.9); margin: 6px 0 0 0; font-size: 13px; font-weight: 500; tracking: 1px;">SEU AGENDAMENTO FOI CONFIRMADO</p>
            </div>
            
            <div style="padding: 32px; background-color: #ffffff;">
              <p style="font-size: 16px; color: #059669; font-weight: 700; margin-top: 0;">Olá, ${event.requesterName}!</p>
              <p style="font-size: 14px; color: #4a4a4a; line-height: 1.6; margin-bottom: 20px;">Parabéns! Seu agendamento de espaço foi **aprovado** pelo setor de eventos e a reserva está confirmada.</p>
              
              <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 20px; margin: 24px 0;">
                <h3 style="margin-top: 0; margin-bottom: 12px; font-size: 12px; color: #047857; text-transform: uppercase; letter-spacing: 1px; font-weight: 800;">Dados da Reserva</h3>
                <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #374151;">
                  <tr>
                    <td style="padding: 6px 0; color: #64748b; font-weight: 500; width: 110px;">Código:</td>
                    <td style="padding: 6px 0; color: #047857; font-weight: 700;">${event.controlCode}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #64748b; font-weight: 500;">Evento:</td>
                    <td style="padding: 6px 0; color: #0f172a; font-weight: 600;">${event.eventTitle}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #64748b; font-weight: 500;">Data:</td>
                    <td style="padding: 6px 0; color: #0f172a; font-weight: 600;">${eventDateFormatted}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #64748b; font-weight: 500;">Horário:</td>
                    <td style="padding: 6px 0; color: #0f172a; font-weight: 600;">${event.startTime} às ${event.endTime}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #64748b; font-weight: 500;">Espaço:</td>
                    <td style="padding: 6px 0; color: #0f172a; font-weight: 600;">${event.selectedRoom}</td>
                  </tr>
                </table>
              </div>

              <p style="font-size: 13px; color: #475569; line-height: 1.6; margin-bottom: 0;">As equipes de logística, T.I., marketing e copa vinculadas foram notificadas e estarão devidamente acionadas para dar todo o suporte ao seu evento.</p>
              
              <hr style="border: 0; border-top: 1px solid #ebd9df; margin: 24px 0;" />
              <p style="font-size: 11px; color: #a1a1a1; text-align: center; margin: 0;">E-mail automático enviado pelo sistema de reservas Unicesusc.</p>
            </div>
          </div>
        </div>
      `,
    });
  }

  /**
   * Notifica o autor que o evento foi REJEITADO
   */
  async sendRejectionNotification(
    event: EventEmailData,
    reason?: string,
  ): Promise<void> {
    const eventDateFormatted = new Date(event.eventDate).toLocaleDateString(
      'pt-BR',
    );

    await this.transporter.sendMail({
      from: this.fromEmail,
      to: event.requesterEmail,
      subject: `❌ Evento não aprovado: ${event.eventTitle} — ${event.controlCode}`,
      html: `
        <div style="font-family: 'Inter', system-ui, -apple-system, sans-serif; background-color: #faf7f8; padding: 40px 20px; margin: 0; min-height: 100%;">
          <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(92, 34, 53, 0.05); border: 1px solid #ebd9df;">
            <div style="background: linear-gradient(135deg, #ef4444, #b91c1c); padding: 32px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase;">❌ Evento Não Aprovado</h1>
              <p style="color: rgba(255, 255, 255, 0.9); margin: 6px 0 0 0; font-size: 13px; font-weight: 500; tracking: 1px;">UNICESUSC — NOTIFICAÇÃO</p>
            </div>
            
            <div style="padding: 32px; background-color: #ffffff;">
              <p style="font-size: 16px; color: #b91c1c; font-weight: 700; margin-top: 0;">Olá, ${event.requesterName}.</p>
              <p style="font-size: 14px; color: #4a4a4a; line-height: 1.6; margin-bottom: 20px;">Lamentamos informar que a sua solicitação de espaço <strong>não foi aprovada</strong> pelo setor responsável.</p>
              
              ${
                reason
                  ? `
              <div style="background: #fffbeb; border: 1px solid #fef08a; border-radius: 12px; padding: 18px; margin: 24px 0; color: #854d0e; font-size: 14px; line-height: 1.6;">
                <strong style="color: #a16207; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 6px;">Motivo da Recusa:</strong>
                ${reason}
              </div>
              `
                  : ''
              }

              <div style="background: #faf7f8; border-radius: 12px; padding: 20px; border: 1px solid #ebd9df; margin: 24px 0;">
                <h3 style="margin-top: 0; margin-bottom: 12px; font-size: 12px; color: #666666; text-transform: uppercase; letter-spacing: 1px; font-weight: 800;">Dados da Solicitação</h3>
                <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #4a4a4a;">
                  <tr>
                    <td style="padding: 6px 0; color: #888888; font-weight: 500; width: 100px;">Código:</td>
                    <td style="padding: 6px 0; color: #5c2235; font-weight: 700;">${event.controlCode}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #888888; font-weight: 500;">Evento:</td>
                    <td style="padding: 6px 0; color: #2d2d2d; font-weight: 600;">${event.eventTitle}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #888888; font-weight: 500;">Data:</td>
                    <td style="padding: 6px 0; color: #2d2d2d; font-weight: 600;">${eventDateFormatted}</td>
                  </tr>
                </table>
              </div>

              <p style="font-size: 13px; color: #666666; line-height: 1.6; margin-bottom: 0;">Caso tenha dúvidas ou queira solicitar ajustes para uma nova data/horário, entre em contato através de: <strong style="color: #5c2235;">formulario.eventos@unicesusc.edu.br</strong>.</p>
              
              <hr style="border: 0; border-top: 1px solid #ebd9df; margin: 24px 0;" />
              <p style="font-size: 11px; color: #a1a1a1; text-align: center; margin: 0;">E-mail automático enviado pelo sistema de reservas Unicesusc.</p>
            </div>
          </div>
        </div>
      `,
    });
  }

  /**
   * Notifica todas as equipes de apoio selecionadas sobre um evento aprovado (envia um único e-mail para todos os destinatários)
   */
  async sendSupportTeamsNotification(
    event: EventEmailData,
    teams: SupportTeamData[],
  ): Promise<void> {
    const emails = Array.from(
      new Set(teams.map((t) => t.email).filter(Boolean)),
    ) as string[];

    if (emails.length === 0) return;

    const eventDateFormatted = new Date(event.eventDate).toLocaleDateString(
      'pt-BR',
    );
    const teamNames = teams.map((t) => t.name).join(', ');
    const formUrl = `${this.frontendUrl}/forms/${event.id}`;

    await this.transporter.sendMail({
      from: this.fromEmail,
      to: emails.join(', '),
      subject: `🔔 Equipes de Apoio Convocadas: ${event.eventTitle} — ${event.controlCode}`,
      html: `
        <div style="font-family: 'Inter', system-ui, -apple-system, sans-serif; background-color: #faf7f8; padding: 40px 20px; margin: 0; min-height: 100%;">
          <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(92, 34, 53, 0.05); border: 1px solid #ebd9df;">
            <div style="background: linear-gradient(135deg, #5c2235, #c22a22); padding: 32px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase;">🔔 Apoio Solicitado</h1>
              <p style="color: rgba(255, 255, 255, 0.8); margin: 6px 0 0 0; font-size: 13px; font-weight: 500; tracking: 1px;">EQUIPES: ${teamNames.toUpperCase()}</p>
            </div>
            
            <div style="padding: 32px; background-color: #ffffff;">
              <p style="font-size: 15px; color: #4a4a4a; line-height: 1.6; margin-top: 0; margin-bottom: 20px;">Olá! Um novo evento foi aprovado no sistema de reservas e <strong>requer o suporte técnico/operacional</strong> das seguintes equipes convocadas: <strong>${teamNames}</strong>.</p>
              
              <div style="background: #faf7f8; border-radius: 12px; padding: 20px; border: 1px solid #ebd9df; margin: 24px 0;">
                <h3 style="margin-top: 0; margin-bottom: 12px; font-size: 12px; color: #c22a22; text-transform: uppercase; letter-spacing: 1px; font-weight: 800;">Logística e Agendamento</h3>
                <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #4a4a4a;">
                  <tr>
                    <td style="padding: 6px 0; color: #888888; font-weight: 500; width: 110px;">Código:</td>
                    <td style="padding: 6px 0; color: #5c2235; font-weight: 700;">${event.controlCode}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #888888; font-weight: 500;">Solicitante:</td>
                    <td style="padding: 6px 0; color: #2d2d2d; font-weight: 600;">${event.requesterName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #888888; font-weight: 500;">Evento:</td>
                    <td style="padding: 6px 0; color: #2d2d2d; font-weight: 600;">${event.eventTitle}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #888888; font-weight: 500;">Data:</td>
                    <td style="padding: 6px 0; color: #2d2d2d; font-weight: 600;">${eventDateFormatted}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #888888; font-weight: 500;">Horário:</td>
                    <td style="padding: 6px 0; color: #2d2d2d; font-weight: 600;">${event.startTime} às ${event.endTime}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #888888; font-weight: 500;">Espaço:</td>
                    <td style="padding: 6px 0; color: #2d2d2d; font-weight: 600;">${event.selectedRoom}</td>
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
}
