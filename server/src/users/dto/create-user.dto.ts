import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  Matches,
  IsInt,
  Min,
} from "class-validator";

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(60)
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Matches(/^\+380\d{9}$/)
  phone: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  positionId: number;

  @IsNotEmpty()
  @IsString()
  photo: string;

}
