import { SortOrder } from "mongoose"

export type User = {
    id: number,
    name: string,
    surname: string,
    authenticationToken?: string | null
}

export type FilterOptions = {
    filter?: {
        search?: string,
        roles?: string[],
        startDate?: Date,
        endDate?: Date
    }
}

export type ListOptions<F = any> = {
    limit?: number;
    page?: number;
    filter?: F,
    search?: string,
    sort?: Record<string, SortOrder>,
    startDate?: string | Date,
    endDate?: string | Date
}

export type PaginatedList<T=any> = {
    docs: T[],
    limit: number,
    offset: number,
    total: number,
    nextPage?: number|null,
    prevPage?: number|null,
    hasNext: boolean,
    currentPage: number
}


export type OTP_METHODS = "WHATSAPP"|"EMAIL"|"BOTH";