import { EventTicketsService } from './event-tickets.service';
import { CreateExternalLocationDto } from './dto/create-external-location.dto';
export declare class LocationsController {
    private readonly eventTicketsService;
    constructor(eventTicketsService: EventTicketsService);
    create(createExternalLocationDto: CreateExternalLocationDto): Promise<{
        message: string;
        location: {
            id: string;
            controlCode: string;
            authorVerification: string;
            adminVerification: string;
        };
    }>;
    verifyAuthor(token: string): Promise<{
        success: boolean;
        message: string;
    }>;
    getAdminReview(token: string): Promise<{
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
    submitAdminReview(body: {
        token: string;
        approved: boolean;
        reason?: string;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
    findAll(): Promise<({
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
    findOne(id: string): Promise<{
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
    remove(id: string): Promise<{
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
