import { EnvironmentConfig } from '@config/env.config';
import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse } from 'axios';
import { catchError, concatAll, map, Observable } from 'rxjs';
import { GitHubBranch } from '../clients/dtos/github-branch';
import { GitHubRepository } from '../clients/dtos/github-repository';
import { GitHubResponse } from '../clients/dtos/github-response';

@Injectable()
export class RepositoriesClient {
  constructor(private readonly httpService: HttpService, private readonly config: ConfigService<EnvironmentConfig>) {}
  readonly baseGitHubUrl = this.config.get('clients.gitHubApi');

  getRepositories(user: string, includeForks: boolean): Observable<GitHubRepository[]> {
    const repositoriesUrl = `${this.baseGitHubUrl}/search/repositories?q=user:${user}+fork:${includeForks}`;

    return this.httpService.get(repositoriesUrl).pipe(
      catchError((_) => {
        throw new HttpException(`Failed to find repositories for user '${user}'`, HttpStatus.NOT_FOUND);
      }),
      map((response: AxiosResponse<GitHubResponse>) => response.data.items),
    );
  }

  getBranches(repository: GitHubRepository): Observable<GitHubBranch[]> {
    const branchesUrl = `${this.baseGitHubUrl}/repos/${repository.owner.login}/${repository.name}/branches`;

    return this.httpService.get(branchesUrl).pipe(
      catchError((error) => {
        throw new HttpException(
          `Failed to find branches for repository '${repository.name}' of user '${repository.owner.login}'`,
          HttpStatus.NOT_FOUND,
        );
      }),
      map((response) => response.data as GitHubBranch[]),
    );
  }
}
