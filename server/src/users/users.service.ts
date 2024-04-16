import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { PhotoService } from "src/photo/photo.service";
import {
  FindAllResponse,
  UserData,
  PaginationSuccessResponse,
  ValidationErrorResponse,
  PageNotFoundErrorResponse,
} from "./interfaces/pagination.interfaces";
import {
  CreateUserResponse,
  FindOneResponse,
} from "./interfaces/users.interface";

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private photoService: PhotoService
  ) {}

  // --------------------------------------------------------------------
  async create(
    createUserDto: CreateUserDto,
    file?: Express.Multer.File
  ): Promise<CreateUserResponse> {
    try {
      const existingUser = await this.prisma.user.findFirst({
        where: {
          OR: [{ email: createUserDto.email }, { phone: createUserDto.phone }],
        },
      });

      if (existingUser) {
        return {
          success: false,
          message: "User with this phone or email already exist",
        };
      }
      const photoUrl = await this.photoService.processAndSavePhoto(
        createUserDto.photo,
        file?.buffer
      );
      const regTimestamp = Math.floor(Date.now() / 1000);
      const newUser = await this.prisma.user.create({
        data: {
          name: createUserDto.name,
          email: createUserDto.email,
          phone: createUserDto.phone,
          positionId: createUserDto.positionId,
          photo: photoUrl,
          registration_timestamp: regTimestamp,
        },
      });
      return {
        success: true,
        user_id: newUser.id,
        message: "New user successfully registered",
      };
    } catch (err) {
      return {
        success: false,
        message: err.message,
      };
    }
  }
  // --------------------------------------------------------------------
  async findAll(page: number, count: number): Promise<FindAllResponse> {
    if (!Number.isInteger(page) || page < 1) {
      const errorResponse: ValidationErrorResponse = {
        success: false,
        message: "Validation failed",
        fails: {
          page: ["The page must be an integer and at least 1."],
        },
      };
      return errorResponse;
    }

    if (!Number.isInteger(count) || count < 1) {
      const errorResponse: ValidationErrorResponse = {
        success: false,
        message: "Validation failed",
        fails: {
          count: ["The count must be an integer and at least 1."],
        },
      };
      return errorResponse;
    }

    try {
      const skip = (page - 1) * count;
      const totalUsers = await this.prisma.user.count();
      const users = await this.prisma.user.findMany({
        take: count,
        skip: skip,
        orderBy: { id: "asc" },
      });

      const totalPages = Math.ceil(totalUsers / count);

      if (page > totalPages && totalPages > 0) {
        const pageNotFoundResponse: PageNotFoundErrorResponse = {
          success: false,
          message: "Page not found",
        };
        return pageNotFoundResponse;
      }

      const successResponse: PaginationSuccessResponse = {
        success: true,
        page: page,
        total_pages: totalPages,
        total_users: totalUsers,
        count: users.length,
        links: {
          next_url:
            page < totalPages ? `/users?page=${page + 1}&count=${count}` : null,
          prev_url: page > 1 ? `/users?page=${page - 1}&count=${count}` : null,
        },
        users: users.map(
          (user) =>
            ({
              id: user.id,
              name: user.name,
              email: user.email,
              phone: user.phone,
              positionId: user.positionId,
              photo: user.photo,
              registration_timestamp: user.registration_timestamp,
            } as UserData)
        ),
      };

      return successResponse;
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  }
  // --------------------------------------------------------------------
  async findOneById(userId: number): Promise<FindOneResponse> {
    if (!Number.isInteger(userId)) {
      throw new BadRequestException({
        success: false,
        message: "Validation failed",
        fails: {
          userId: ["The user ID must be an integer."],
        },
      });
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException({
        success: false,
        message: "The user with the requested ID does not exist",
      });
    }

    return {
      success: true,
      user,
    };
  }
  // --------------------------------------------------------------------
}
