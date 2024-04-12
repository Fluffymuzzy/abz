import { Controller, Get } from "@nestjs/common";
import { TokenService } from "./token.service";

@Controller("token")
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}
  // --------------------------------------------------------------------
  @Get()
  async generateToken() {
    const token = await this.tokenService.generateToken();
    return token;
  }
  // --------------------------------------------------------------------
}
