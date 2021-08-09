import { ApiResponseProperty } from '@nestjs/swagger';
import { BranchResponse } from './branch-response';

export class RepositoriesResponse {
  @ApiResponseProperty()
  name: string;
  @ApiResponseProperty()
  owner: string;
  @ApiResponseProperty({ type: [BranchResponse] })
  branches: BranchResponse[];
}
