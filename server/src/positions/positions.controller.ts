import { Controller, Get } from "@nestjs/common";
import { ErrorResponse, PositionsResponse } from "./interfaces/positions.interface";
import { PositionsService } from "./positions.service";
@Controller("positions")
export class PositionsController {
  constructor(private positionsService: PositionsService) {}
  // --------------------------------------------------------------------
  @Get()
  async getPositions(): Promise<PositionsResponse | ErrorResponse> {
    return await this.positionsService.findAllPositions();
  }
  // --------------------------------------------------------------------
}
