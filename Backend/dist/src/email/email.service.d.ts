import { ConfigService } from '@nestjs/config';
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
export declare class EmailService {
    private configService;
    private resend;
    private fromEmail;
    private frontendUrl;
    constructor(configService: ConfigService);
    sendAuthorVerification(event: EventEmailData, token: string): Promise<void>;
    sendAdminApproval(event: EventEmailData, token: string): Promise<void>;
    sendApprovalNotification(event: EventEmailData): Promise<void>;
    sendRejectionNotification(event: EventEmailData): Promise<void>;
    sendSupportTeamNotification(event: EventEmailData, team: SupportTeamData): Promise<void>;
}
export {};
