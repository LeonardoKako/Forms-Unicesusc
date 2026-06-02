import { EventTicketsService } from './event-tickets.service';
import { CreateExternalLocationDto } from './dto/create-external-location.dto';
export declare class LocationsController {
    private readonly eventTicketsService;
    constructor(eventTicketsService: EventTicketsService);
    create(createExternalLocationDto: CreateExternalLocationDto): Promise<{
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
    }>;
}
