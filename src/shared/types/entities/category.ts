// Category entity types extracted from categoryService.ts
export interface Category {
  id: string;
  name?: string;
  description?: string;
  imageUrl?: string;
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
  image?: File;
}

export interface UpdateCategoryRequest {
  name: string;
  description?: string;
  image?: File;
}

export interface CreateCategoryResponse {
  id: string;
  imageUrl?: string;
}