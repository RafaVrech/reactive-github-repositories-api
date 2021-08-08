import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { catchError, combineLatestAll, concatAll, concatMap, map, of } from 'rxjs';
import { RepositoriesResponse } from 'src/repositories/entities/repositories-response';
import { GetRepositoriesQuery } from './dto/get-repositories.query';
import { BranchResponse } from './entities/branch-response';
import { GitHubBranch } from './entities/github-branch';
import { GitHubRepository } from './entities/github-repository';
import { GitHubResponse } from './entities/github-response';

@Injectable()
export class RepositoriesService {
  constructor(private readonly httpService: HttpService) {}

  async getRepositories(user: string, getRepositoriesQuery: GetRepositoriesQuery) {
    const repositoriesUrl = `https://api.github.com/search/repositories?q=user:${user}+fork:${getRepositoriesQuery.includeForks}`;

    return this.httpService.get(repositoriesUrl).pipe(
      catchError((_) => {
        throw new HttpException(`Failed to find repositories for user '${user}'`, HttpStatus.NOT_FOUND);
      }),
      map((response: AxiosResponse<GitHubResponse>) => response.data.items),
      concatAll(),
      concatMap((repository) => this.getBranches(repository)),
      combineLatestAll(),
    );
  }

  async getBranches(repository: GitHubRepository) {
    const branchesUrl = `https://api.github.com/repos/${repository.owner.login}/${repository.name}/branches`;
    return this.httpService.get(branchesUrl).pipe(
      catchError((error) => {
        throw new HttpException(
          `Failed to find branches for repository '${repository.owner.login}' of user '${repository.owner.login}'`,
          HttpStatus.NOT_FOUND,
        );
      }),
      map((response) => response.data as GitHubBranch[]),
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
      catchError((e) => of(`I caught: ${e} in ${branchesUrl}`)),
    );
  }
}
