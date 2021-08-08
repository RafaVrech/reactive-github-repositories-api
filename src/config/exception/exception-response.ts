import { ApiResponseProperty } from "@nestjs/swagger";

export class ExceptionResponse {
  @ApiResponseProperty()
  status: string;
  @ApiResponseProperty()
  message: string;
}
