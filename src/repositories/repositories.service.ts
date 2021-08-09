import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse } from 'axios';
import { catchError, combineLatestAll, concatAll, concatMap, map, Observable, of } from 'rxjs';
import { EnvironmentConfig } from 'src/config/env.config';
import { RepositoriesResponse } from 'src/repositories/entities/repositories-response';
import { GetRepositoriesQuery } from './dto/get-repositories.query';
import { BranchResponse } from './entities/branch-response';
import { GitHubBranch } from './entities/github-branch';
import { GitHubRepository } from './entities/github-repository';
import { GitHubResponse } from './entities/github-response';

@Injectable()
export class RepositoriesService {
  constructor(private readonly httpService: HttpService, private readonly config: ConfigService<EnvironmentConfig>) {}

  async getRepositories(user: string, getRepositoriesQuery: GetRepositoriesQuery): Promise<Observable<RepositoriesResponse[]>> {
    const repositoriesUrl = `${this.config.get('clients.gitHubApi')}/search/repositories?q=user:${user}+fork:${getRepositoriesQuery.includeForks}`;

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

  async getBranches(repository: GitHubRepository): Promise<Observable<RepositoriesResponse>> {
    const branchesUrl = `${this.config.get('clients.gitHubApi')}/repos/${repository.owner.login}/${repository.name}/branches`;
    return this.httpService.get(branchesUrl).pipe(
      catchError((error) => {
        throw new HttpException(
          `Failed to find branches for repository '${repository.name}' of user '${repository.owner.login}'`,
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
    );
  }
}
