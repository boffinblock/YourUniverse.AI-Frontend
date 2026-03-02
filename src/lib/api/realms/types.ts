import { ApiResponse, PaginationInfo } from "../shared/types";

/**
 * Realm Rating
 */
export type RealmRating = "SFW" | "NSFW";

/**
 * Realm Visibility
 */
export type RealmVisibility = "public" | "private";

/**
 * Realm Image Asset
 */
export interface RealmImage {
    url: string;
}

/**
 * Character Reference in Realm
 */
export interface CharacterReference {
    id: string;
    name: string;
    avatar?: RealmImage;
}

/**
 * Realm Object
 */
export interface Realm {
    id: string;
    name: string;
    slug: string;
    description?: string;
    tags?: string[];
    rating: RealmRating;
    visibility: RealmVisibility;
    isFavourite: boolean;
    avatar?: RealmImage;
    characters?: CharacterReference[];
    createdAt: string;
    updatedAt: string;
    userId?: string;
}

/**
 * Create Realm Request
 */
export interface CreateRealmRequest {
    name: string;
    description?: string;
    tags?: string[];
    rating: RealmRating;
    visibility: RealmVisibility;
    avatar?: File | string;
    characterIds?: string[];
}

/**
 * Update Realm Request
 */
export interface UpdateRealmRequest {
    name?: string;
    description?: string;
    tags?: string[];
    rating?: RealmRating;
    visibility?: RealmVisibility;
    avatar?: File | string;
    isFavourite?: boolean;
}

/**
 * Realm Responses
 */
export interface RealmResponse {
    realm: Realm;
    message?: string;
}

export interface ListRealmsResponse {
    realms: Realm[];
    pagination: PaginationInfo;
}

export interface DeleteRealmResponse {
    message: string;
}
