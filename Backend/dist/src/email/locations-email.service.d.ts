import { ConfigService } from '@nestjs/config';
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
export declare class LocationsEmailService {
    private configService;
    private resend;
    private fromEmail;
    private locationVerifierEmail;
    private adminEmail;
    private frontendUrl;
    constructor(configService: ConfigService);
    sendLocationAuthorVerification(location: LocationEmailData, token: string): Promise<void>;
    sendLocationAdminApproval(location: LocationEmailData, token: string): Promise<void>;
    sendLocationApprovalNotification(location: LocationEmailData): Promise<void>;
    sendLocationRejectionNotification(location: LocationEmailData, reason?: string): Promise<void>;
    sendLocationSupportTeamsNotification(location: LocationEmailData, teams: SupportTeamData[]): Promise<void>;
}
export {};
