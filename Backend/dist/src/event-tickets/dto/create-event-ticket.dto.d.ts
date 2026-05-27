export declare enum RequesterType {
    INTERNO = "interno",
    LOCACAO = "locacao"
}
export declare class CreateEventTicketDto {
    requesterName: string;
    requesterEmail: string;
    requesterPhone: string;
    requesterType: string;
    requesterDepartment?: string;
    adminApprovalFileUrl?: string;
    isPartnerEvent?: boolean;
    partnerName?: string;
    partnerEmail?: string;
    partnerPhone?: string;
    partnerInstitution?: string;
    eventTitle: string;
    eventType: string;
    eventDescription: string;
    targetAudience: string[];
    estimatedPublic: number;
    eventDate: string;
    startTime: string;
    endTime: string;
    selectedRoom: string;
    needsBudget?: boolean;
    budgetApprovalFileUrl?: string;
    copa?: string[];
    coffeeBreak?: string[];
    tiEquipment?: string[];
    furnitureSupport?: string[];
    supportTeams?: string[];
    presentationMaterials?: string[];
    presentationDriveLink?: string;
    needsArtwork?: boolean;
    artworkDescription?: string;
}
