import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

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
export class EmailService {
  private resend: Resend;
  private fromEmail = 'onboarding@resend.dev';
  private frontendUrl: string;

  constructor(private configService: ConfigService) {
    this.resend = new Resend(this.configService.get<string>('RESEND_API_KEY'));
    this.frontendUrl =
      this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';
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

    await this.resend.emails.send({
      from: this.fromEmail,
      to: event.requesterEmail,
      subject: `🔑 Confirme seu evento: ${event.eventTitle} — ${event.controlCode}`,
      html: `
        <div style="font-family: 'Inter', system-ui, -apple-system, sans-serif; background-color: #faf7f8; padding: 40px 20px; margin: 0; min-height: 100%;">
          <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(92, 34, 53, 0.05); border: 1px solid #ebd9df;">
            <div style="background: linear-gradient(135deg, #5c2235, #c22a22); padding: 32px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase;">📋 Confirmação de Evento</h1>
              <p style="color: rgba(255, 255, 255, 0.8); margin: 6px 0 0 0; font-size: 13px; font-weight: 500; tracking: 1px;">UNICESUSC — SISTEMA DE RESERVAS</p>
            </div>
            
            <div style="padding: 32px; background-color: #ffffff;">
              <p style="font-size: 16px; color: #5c2235; font-weight: 700; margin-top: 0;">Olá, ${event.requesterName}!</p>
              <p style="font-size: 14px; color: #4a4a4a; line-height: 1.6; margin-bottom: 24px;">Recebemos sua solicitação de evento. Para prosseguir e enviar o agendamento para análise da coordenação de eventos, confirme seu e-mail clicando no botão abaixo:</p>
              
              <div style="background: #faf7f8; border-radius: 12px; padding: 20px; border: 1px solid #ebd9df; margin: 24px 0;">
                <h3 style="margin-top: 0; margin-bottom: 12px; font-size: 12px; color: #c22a22; text-transform: uppercase; letter-spacing: 1px; font-weight: 800;">Dados da Reserva</h3>
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
                <a href="${verifyUrl}" 
                   style="background: linear-gradient(135deg, #5c2235, #c22a22); color: #ffffff; padding: 14px 32px; border-radius: 10px; text-decoration: none; font-weight: 700; font-size: 14px; display: inline-block; box-shadow: 0 4px 10px rgba(194, 42, 34, 0.15);">
                  ✅ Confirmar e Enviar para Análise
                </a>
              </div>

              <div style="background: #fffbeb; border: 1px solid #fef3c7; border-radius: 10px; padding: 12px; text-align: center; margin-top: 24px;">
                <p style="font-size: 12px; color: #b45309; margin: 0; font-weight: 500;">
                  ⏰ Este link expira em <strong>30 minutos</strong>. Após esse prazo, a solicitação será cancelada automaticamente.
                </p>
              </div>
              
              <hr style="border: 0; border-top: 1px solid #ebd9df; margin: 24px 0;" />
              <p style="font-size: 11px; color: #a1a1a1; text-align: center; margin: 0;">Se você não solicitou este agendamento, por favor ignore este e-mail.</p>
            </div>
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

    await this.resend.emails.send({
      from: this.fromEmail,
      to: 'formulario.eventos@unicesusc.edu.br',
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
                    <td style="padding: 6px 0; color: #2d2d2d; font-weight: 600;">${event.requesterName} (<span style="color: #c22a22; font-weight: 500;">${event.requesterEmail}</span>)</td>
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
                  📋 Analisar e Decidir Reserva
                </a>
              </div>

              <div style="background: #faf7f8; border: 1px solid #ebd9df; border-radius: 10px; padding: 12px; text-align: center;">
                <p style="font-size: 12px; color: #666666; margin: 0;">
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

    await this.resend.emails.send({
      from: this.fromEmail,
      to: event.requesterEmail,
      subject: `✅ Evento aprovado: ${event.eventTitle} — ${event.controlCode}`,
      html: `
        <div style="font-family: 'Inter', system-ui, -apple-system, sans-serif; background-color: #faf7f8; padding: 40px 20px; margin: 0; min-height: 100%;">
          <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(92, 34, 53, 0.05); border: 1px solid #ebd9df;">
            <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 32px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase;">✅ Reserva Aprovada!</h1>
              <p style="color: rgba(255, 255, 255, 0.9); margin: 6px 0 0 0; font-size: 13px; font-weight: 500; tracking: 1px;">UNICESUSC — CONFIRMAÇÃO</p>
            </div>
            
            <div style="padding: 32px; background-color: #ffffff;">
              <p style="font-size: 16px; color: #059669; font-weight: 700; margin-top: 0;">Olá, ${event.requesterName}!</p>
              <p style="font-size: 14px; color: #4a4a4a; line-height: 1.6; margin-bottom: 24px;">Temos o prazer de informar que seu evento foi <strong>aprovado com sucesso</strong> pela nossa equipe de eventos.</p>
              
              <div style="background: #f0fdf4; border-radius: 12px; padding: 20px; border: 1px solid #bbf7d0; margin: 24px 0;">
                <h3 style="margin-top: 0; margin-bottom: 12px; font-size: 12px; color: #047857; text-transform: uppercase; letter-spacing: 1px; font-weight: 800;">Resumo da Reserva</h3>
                <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #1e293b;">
                  <tr>
                    <td style="padding: 6px 0; color: #64748b; font-weight: 500; width: 100px;">Código:</td>
                    <td style="padding: 6px 0; color: #0f172a; font-weight: 700;">${event.controlCode}</td>
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

    await this.resend.emails.send({
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
   * Notifica uma equipe de apoio sobre um evento aprovado
   */
  async sendSupportTeamNotification(
    event: EventEmailData,
    team: SupportTeamData,
  ): Promise<void> {
    if (!team.email) return;

    const eventDateFormatted = new Date(event.eventDate).toLocaleDateString(
      'pt-BR',
    );

    await this.resend.emails.send({
      from: this.fromEmail,
      to: team.email,
      subject: `🔔 Evento aprovado requer sua equipe: ${event.eventTitle} — ${event.controlCode}`,
      html: `
        <div style="font-family: 'Inter', system-ui, -apple-system, sans-serif; background-color: #faf7f8; padding: 40px 20px; margin: 0; min-height: 100%;">
          <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(92, 34, 53, 0.05); border: 1px solid #ebd9df;">
            <div style="background: linear-gradient(135deg, #5c2235, #c22a22); padding: 32px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase;">🔔 Equipe Acionada</h1>
              <p style="color: rgba(255, 255, 255, 0.8); margin: 6px 0 0 0; font-size: 13px; font-weight: 500; tracking: 1px;">GRUPO DE APOIO: ${team.name.toUpperCase()}</p>
            </div>
            
            <div style="padding: 32px; background-color: #ffffff;">
              <p style="font-size: 15px; color: #4a4a4a; line-height: 1.6; margin-top: 0; margin-bottom: 20px;">Olá! Um novo evento foi aprovado no sistema de reservas e <strong>requer o suporte técnico/operacional</strong> da equipe <strong>${team.name}</strong>.</p>
              
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
              
              <hr style="border: 0; border-top: 1px solid #ebd9df; margin: 24px 0;" />
              <p style="font-size: 11px; color: #a1a1a1; text-align: center; margin: 0;">E-mail automático enviado pelo sistema de reservas Unicesusc.</p>
            </div>
          </div>
        </div>
      `,
    });
  }
}
