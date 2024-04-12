import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Res,
  UploadedFile,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { Response } from "express";
import { AuthGuard } from "src/token/auth.guard";
import { PaginationParamsDto } from "./dto/pagination-params.dto";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  // --------------------------------------------------------------------
  @Post()
  @UseGuards(AuthGuard)
  async create(
    @Body() createUserDto: CreateUserDto,
    @Res() res: Response,
    @UploadedFile() file: Express.Multer.File
  ) {
    try {
      const user = await this.usersService.create(createUserDto, file);

      if (user.success) {
        return res.status(HttpStatus.CREATED).json(user);
      } else {
        return res.status(HttpStatus.BAD_REQUEST).json(user);
      }
    } catch (err) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: err.message,
      });
    }
  }
  // --------------------------------------------------------------------
  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async getUsers(
    @Query() paginationParams: PaginationParamsDto,
    @Res() res: Response
  ) {
    const paginationResult = await this.usersService.findAll(
      paginationParams.page,
      paginationParams.count
    );

    if (!paginationResult.success) {
      res.status(HttpStatus.BAD_REQUEST).json(paginationResult);
    } else {
      res.json(paginationResult);
    }
  }
  // --------------------------------------------------------------------
  @Get(":id")
  async getUserById(@Param("id", ParseIntPipe) id: number): Promise<any> {
    try {
      return await this.usersService.findOneById(id);
    } catch (err) {
      throw err;
    }
  }
  // --------------------------------------------------------------------
}
