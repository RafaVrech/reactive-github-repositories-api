import { ApiProperty, ApiPropertyOptional, ApiQuery } from "@nestjs/swagger";

export class GetRepositoriesQuery {
  @ApiProperty({
    type: Boolean,
  })
  @ApiPropertyOptional()
  includeForks = false;
}
