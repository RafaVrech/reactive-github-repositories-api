import { ApiResponseProperty } from '@nestjs/swagger';

export class BranchResponse {
  @ApiResponseProperty()
  name: string;
  @ApiResponseProperty()
  lastCommitSHA: string;
}
