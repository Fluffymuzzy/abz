import { Injectable, NotFoundException } from "@nestjs/common";
import {
  ErrorResponse,
  PositionsResponse,
} from "./interfaces/positions.interface";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class PositionsService {
  constructor(private prisma: PrismaService) {}
  // --------------------------------------------------------------------
  async findAllPositions(): Promise<PositionsResponse | ErrorResponse> {
    try {
      const positions = await this.prisma.position.findMany();

      if (!positions.length) {
        return { success: false, message: "Positions not found" };
      }

      const mappedPositions = positions.map((p) => ({
        id: p.id,
        name: p.position,
      }));

      return {
        success: true,
        positions: mappedPositions,
      };
    } catch (err) {
      return { success: false, message: "An unexpected error occurred" };
    }
  }
  // --------------------------------------------------------------------
}
