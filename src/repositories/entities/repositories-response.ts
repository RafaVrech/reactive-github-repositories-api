import { BranchResponse } from "./branch-response";

export class RepositoriesResponse {
    name: string;
    owner: string;
    branches: BranchResponse[]
}