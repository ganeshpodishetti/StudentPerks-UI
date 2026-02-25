// Store entity types based on backend DTOs
// UpdateStoreRequest(string Title, string? Website, string? LogoUrl)
// CreateStoreRequest(string Title, string? Website, string? LogoUrl)
// StoreResponse(Guid Id, string? Title, string? Website, string? LogoUrl)
export interface Store {
  id: string;
  title: string;
  website?: string;
  logoUrl?: string;
}

export interface CreateStoreRequest {
  title: string;
  website?: string;
  logoUrl?: string;
}

export interface UpdateStoreRequest {
  title: string;
  website?: string;
  logoUrl?: string;
}