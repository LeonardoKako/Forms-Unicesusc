import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LocationsEmailService } from '../email/locations-email.service';
import { CreateExternalLocationDto } from './dto/create-external-location.dto';
export declare class LocationsService {
    private readonly prisma;
    private readonly jwtService;
    private readonly locationsEmailService;
    private readonly logger;
    constructor(prisma: PrismaService, jwtService: JwtService, locationsEmailService: LocationsEmailService);
    private generateUniqueControlCode;
    private validateDateTime;
    createExternal(dto: CreateExternalLocationDto): Promise<{
        message: string;
        location: {
            id: string;
            controlCode: string;
            authorVerification: string;
            adminVerification: string;
        };
    }>;
    verifyLocationAuthor(token: string): Promise<{
        success: boolean;
        message: string;
    }>;
    getLocationAdminReview(token: string): Promise<{
        supportTeams: {
            id: string;
            name: string;
            email: string | null;
        }[];
    } & {
        id: string;
        requesterType: string;
        requesterName: string;
        requesterEmail: string;
        requesterPhone: string;
        eventDate: Date;
        startTime: string;
        endTime: string;
        selectedRoom: string;
        roomNotes: string | null;
        controlCode: string;
        createdAt: Date;
        updatedAt: Date;
        authorVerification: string;
        adminVerification: string;
        adminRejectionReason: string | null;
    }>;
    submitLocationAdminReview(token: string, approved: boolean, reason?: string): Promise<{
        success: boolean;
        message: string;
    }>;
    findAllLocations(): Promise<({
        supportTeams: {
            id: string;
            name: string;
            email: string | null;
        }[];
    } & {
        id: string;
        requesterType: string;
        requesterName: string;
        requesterEmail: string;
        requesterPhone: string;
        eventDate: Date;
        startTime: string;
        endTime: string;
        selectedRoom: string;
        roomNotes: string | null;
        controlCode: string;
        createdAt: Date;
        updatedAt: Date;
        authorVerification: string;
        adminVerification: string;
        adminRejectionReason: string | null;
    })[]>;
    findOneLocation(id: string): Promise<{
        supportTeams: {
            id: string;
            name: string;
            email: string | null;
        }[];
    } & {
        id: string;
        requesterType: string;
        requesterName: string;
        requesterEmail: string;
        requesterPhone: string;
        eventDate: Date;
        startTime: string;
        endTime: string;
        selectedRoom: string;
        roomNotes: string | null;
        controlCode: string;
        createdAt: Date;
        updatedAt: Date;
        authorVerification: string;
        adminVerification: string;
        adminRejectionReason: string | null;
    }>;
    removeLocation(id: string): Promise<{
        id: string;
        requesterType: string;
        requesterName: string;
        requesterEmail: string;
        requesterPhone: string;
        eventDate: Date;
        startTime: string;
        endTime: string;
        selectedRoom: string;
        roomNotes: string | null;
        controlCode: string;
        createdAt: Date;
        updatedAt: Date;
        authorVerification: string;
        adminVerification: string;
        adminRejectionReason: string | null;
    }>;
}
