/** User entity – mirrors CurrentUserResponse / GetUserResponse from the backend */
export interface User {
  username: string;
  email: string;
  emailConfirmed: boolean;
  roles: string[];
}


