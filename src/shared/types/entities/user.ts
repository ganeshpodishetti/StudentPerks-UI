// User entity types
export interface User {
  username: string;
  email: string;
  emailConfirmed: boolean;
  roles: string[];
}

export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
}

export interface UpdateUserRequest {
  username?: string;
  email?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  requiresMfa: boolean;
  lockoutEnd: string | null;
  message: string;
}