import { UserData } from "./pagination.interfaces";

export interface CreateUserResponse {
    success: boolean;
    user_id?: number;
    message?: string;
  }
  
  export interface FindOneResponse {
    success: boolean;
    user?: UserData;
    message?: string;
  }