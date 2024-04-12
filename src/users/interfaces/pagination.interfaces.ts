export interface UserData {
  id: number;
  name: string;
  email: string;
  phone: string;
  positionId: number;
  photo: string;
  registration_timestamp: number;
}

export interface PaginationSuccessResponse {
  success: true;
  page: number;
  total_pages: number;
  total_users: number;
  count: number;
  links: {
    next_url: string | null;
    prev_url: string | null;
  };
  users: UserData[];
}

export interface ValidationErrorResponse {
  success: false;
  message: "Validation failed";
  fails: {
    count?: string[];
    page?: string[];
  };
}

export interface PageNotFoundErrorResponse {
  success: false;
  message: "Page not found";
}

export type FindAllResponse =
  | PaginationSuccessResponse
  | ValidationErrorResponse
  | PageNotFoundErrorResponse;
