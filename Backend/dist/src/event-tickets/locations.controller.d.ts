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
        controlCode: string;
        createdAt: Date;
        updatedAt: Date;
        requesterName: string;
        requesterEmail: string;
        requesterPhone: string;
        requesterType: string;
        eventDate: Date;
        startTime: string;
        endTime: string;
        selectedRoom: string;
        roomNotes: string | null;
    }>;
    findAll(): Promise<({
        supportTeams: {
            id: string;
            name: string;
            email: string | null;
        }[];
    } & {
        id: string;
        controlCode: string;
        createdAt: Date;
        updatedAt: Date;
        requesterName: string;
        requesterEmail: string;
        requesterPhone: string;
        requesterType: string;
        eventDate: Date;
        startTime: string;
        endTime: string;
        selectedRoom: string;
        roomNotes: string | null;
    })[]>;
    findOne(id: string): Promise<{
        supportTeams: {
            id: string;
            name: string;
            email: string | null;
        }[];
    } & {
        id: string;
        controlCode: string;
        createdAt: Date;
        updatedAt: Date;
        requesterName: string;
        requesterEmail: string;
        requesterPhone: string;
        requesterType: string;
        eventDate: Date;
        startTime: string;
        endTime: string;
        selectedRoom: string;
        roomNotes: string | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        controlCode: string;
        createdAt: Date;
        updatedAt: Date;
        requesterName: string;
        requesterEmail: string;
        requesterPhone: string;
        requesterType: string;
        eventDate: Date;
        startTime: string;
        endTime: string;
        selectedRoom: string;
        roomNotes: string | null;
    }>;
}
