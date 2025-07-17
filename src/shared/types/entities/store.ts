// Store entity types extracted from storeService.ts
export interface Store {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  websiteUrl?: string;
  isActive?: boolean;
}

export interface CreateStoreRequest {
  name: string;
  description?: string;
  websiteUrl?: string;
  image?: File;
}

export interface UpdateStoreRequest {
  name: string;
  description?: string;
  websiteUrl?: string;
  isActive: boolean;
  image?: File;
}