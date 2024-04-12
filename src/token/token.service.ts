import { PrismaService } from "src/prisma/prisma.service";
import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import * as jwt from "jsonwebtoken";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class TokenService {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService
  ) {}

  private readonly secret = this.configService.get<string>("JWT_SECRET_KEY");
  private readonly expiresIn = this.configService.get<string>("JWT_EXP");
  // --------------------------------------------------------------------
  async generateToken() {
    const token = jwt.sign({}, this.secret, { expiresIn: this.expiresIn });

    const expirationDate = new Date();
    expirationDate.setMinutes(expirationDate.getMinutes() + parseInt(this.expiresIn));

    await this.prisma.token.create({
      data: {
        token,
        expirationDate,
        isUsed: false,
      },
    });

    return { success: true, token };
  }
  // --------------------------------------------------------------------
  async validateToken(
    token: string
  ): Promise<{ success: boolean; message?: string }> {
    try {
      jwt.verify(token, this.secret);
      return { success: true };
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new UnauthorizedException({
          success: false,
          message: "The token expired",
        });
      } else {
        throw new UnauthorizedException({
          success: false,
          message: "Invalid token",
        });
      }
    }
  }
  // --------------------------------------------------------------------
  async findTokenRecord(token: string): Promise<void> {
    const tokenRecord = await this.prisma.token.findUnique({
      where: { token },
    });
    if (!tokenRecord) {
      throw new HttpException(
        { success: false, message: "Token not found" },
        HttpStatus.UNAUTHORIZED
      );
    }
    if (tokenRecord.isUsed) {
      throw new HttpException(
        { success: false, message: "Token is already used" },
        HttpStatus.UNAUTHORIZED
      );
    }
  }
  // --------------------------------------------------------------------
  async markTokenAsUsed(token: string): Promise<void> {
    await this.prisma.token.update({
      where: { token },
      data: { isUsed: true },
    });
  }
  // --------------------------------------------------------------------
}
