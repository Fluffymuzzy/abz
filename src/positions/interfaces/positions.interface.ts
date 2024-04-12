export interface PositionsResponse {
  success: boolean;
  positions: { id: number; name: string }[];
}

export interface ErrorResponse {
    success: boolean;
    message: string;
  }
  
