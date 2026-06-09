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
interface LocationEmailData {
    id: string;
    controlCode: string;
    requesterName: string;
    requesterEmail: string;
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
    private adminEmail;
    private locationVerifierEmail;
    private frontendUrl;
    constructor(configService: ConfigService);
    sendAuthorVerification(event: EventEmailData, token: string): Promise<void>;
    sendAdminApproval(event: EventEmailData, token: string): Promise<void>;
    sendApprovalNotification(event: EventEmailData): Promise<void>;
    sendRejectionNotification(event: EventEmailData, reason?: string): Promise<void>;
    sendSupportTeamsNotification(event: EventEmailData, teams: SupportTeamData[]): Promise<void>;
    sendLocationAuthorVerification(location: LocationEmailData, token: string): Promise<void>;
    sendLocationAdminApproval(location: LocationEmailData, token: string): Promise<void>;
    sendLocationApprovalNotification(location: LocationEmailData): Promise<void>;
    sendLocationRejectionNotification(location: LocationEmailData, reason?: string): Promise<void>;
    sendLocationSupportTeamsNotification(location: LocationEmailData, teams: SupportTeamData[]): Promise<void>;
}
export {};
