import { Type } from "class-transformer";
import { IsInt, Min } from "class-validator";

export class PaginationParamsDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  count: number = 5;
}
