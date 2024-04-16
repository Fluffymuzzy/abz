import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { TokenService } from "./token.service";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly tokenService: TokenService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization.split(" ")[1];

    if (!token) {
      throw new UnauthorizedException({
        success: false,
        message: "Token is missing",
      });
    }

    await this.tokenService.findTokenRecord(token);
    await this.tokenService.validateToken(token);
    await this.tokenService.markTokenAsUsed(token);

    return true;
  }
}
