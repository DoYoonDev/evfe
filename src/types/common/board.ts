export interface Board {
    id: number;
    rowNumber: number;
    attachFileGroupId: number;
    attachFiles?: AttachFile[];
    content: string;
    title: string;
    createMemberId: string;
    createdAt: string;
    updateMemberId: string;
    updatedAt: string;
    viewCount: number;
    isPin: boolean;
}

export interface AttachFile {
    id: number;
    name: string;
    saveName: string;
    path: string;
}

export type BoardListFilter = {
    column?: string;
    keyword?: string;
    page: number;
    size: number;
    sortField?: string;
    sortDirection?: 'asc' | 'desc';
    sort?: string;  
}

export type BoardCreate = {
    attachFileGroupId?: number[];
    content: string;
    title: string;
    createMemberId: string;
    isPin: boolean;
}
