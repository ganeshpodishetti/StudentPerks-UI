// User entity types
export interface User {
  firstName: string;
  lastName: string;
  email: string;
  emailConfirmed: boolean;
  roles: string[];
  username?: string;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
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