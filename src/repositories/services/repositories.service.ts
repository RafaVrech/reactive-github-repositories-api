import { Injectable } from '@nestjs/common';
import { combineLatestAll, concatAll, concatMap, map, Observable } from 'rxjs';
import { GitHubRepository } from '../clients/dtos/github-repository';
import { RepositoriesClient } from '../clients/repository.client';
import { GetRepositoriesQuery } from '../controllers/queries/get-repositories.query';
import { BranchResponse } from './entities/branch.response';
import { RepositoriesResponse } from './entities/repositories.response';

@Injectable()
export class RepositoriesService {
  constructor(private readonly repositoriesClient: RepositoriesClient) {}

  getRepositories(user: string, getRepositoriesQuery: GetRepositoriesQuery): Observable<RepositoriesResponse[]> {
    return this.repositoriesClient.getRepositories(user, getRepositoriesQuery.includeForks).pipe(
      concatAll(),
      concatMap((repository) => this.getBranches(repository)),
      combineLatestAll(),
    );
  }

  async getBranches(repository: GitHubRepository): Promise<Observable<RepositoriesResponse>> {
    return this.repositoriesClient.getBranches(repository).pipe(
      map((branches) => {
        const branchesResponse = branches.map((branch) => {
          return {
            name: branch.name,
            lastCommitSHA: branch.commit.sha,
          } as BranchResponse;
        });

        return {
          name: repository.name,
          owner: repository.owner.login,
          branches: branchesResponse,
        } as RepositoriesResponse;
      }),
    );
  }
}
