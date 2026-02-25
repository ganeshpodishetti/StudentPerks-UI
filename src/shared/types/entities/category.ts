// Category entity types extracted from categoryService.ts
export interface Category {
  id: string;
  title?: string;
}

export interface CreateCategoryRequest {
  title: string;
}

export interface UpdateCategoryRequest {
  title: string;
}

export interface CreateCategoryResponse {
  id: string;
}