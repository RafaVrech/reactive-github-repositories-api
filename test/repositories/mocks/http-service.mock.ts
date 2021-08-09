import { HttpException, HttpStatus } from '@nestjs/common';
import { GitHubBranch } from '@src/repositories/clients/dtos/github-branch';
import { GitHubRepository } from '@src/repositories/clients/dtos/github-repository';
import { GitHubResponse } from '@src/repositories/clients/dtos/github-response';
import { AxiosResponse } from 'axios';
import { of, throwError } from 'rxjs';

export class RepositoriesHttpServiceMock {
  static readonly mockReturn = {
    repositories: {
      success: 'repositoriesSuccess',
      notFound: 'repositoriesNotFound',
    },
    branches: {
      success: 'branchesSuccess',
      notFound: 'branchesNotFound',
      error: 'branchesError',
    },
  };
  private gitHubBranch: GitHubBranch = {
    name: 'branchName',
    commit: {
      sha: 'branchSha',
      url: 'branchUrl',
    },
    protected: false,
  };

  private gitHubRepository1: GitHubRepository = {
    name: 'name1',
    owner: {
      login: 'owner1',
    },
    branches_url: 'branches_url1',
    commits_url: 'commits_url1',
  };

  private gitHubRepository2: GitHubRepository = {
    name: 'name2',
    owner: {
      login: 'owner2',
    },
    branches_url: 'branches_url2',
    commits_url: 'commits_url2',
  };
  private gitHubRepositories: GitHubRepository[] = [this.gitHubRepository1, this.gitHubRepository2];

  private repositoriesAxiosResponse: AxiosResponse = {
    status: HttpStatus.OK,
    config: {},
    headers: {},
    statusText: '',
    data: {
      items: this.gitHubRepositories,
    } as GitHubResponse,
  };

  private branchesAxiosResponse: AxiosResponse = {
    status: HttpStatus.OK,
    config: {},
    headers: {},
    statusText: '',
    data: [this.gitHubBranch],
  };

  private repositoriesBranchesErrorResponse: AxiosResponse = {
    status: HttpStatus.OK,
    config: {},
    headers: {},
    statusText: '',
    data: {
      items: [ { ...this.gitHubRepository1, name: RepositoriesHttpServiceMock.mockReturn.branches.error } ],
    } as GitHubResponse
  };

  get(path: string, includeForks = false) {
    if (path.includes(RepositoriesHttpServiceMock.mockReturn.repositories.success)) 
      return of(this.repositoriesAxiosResponse);
    else if (path.includes(RepositoriesHttpServiceMock.mockReturn.repositories.notFound))
      return throwError(() => {
        return new HttpException('error', HttpStatus.BAD_REQUEST);
      });
    else if (path.includes(RepositoriesHttpServiceMock.mockReturn.branches.success)) 
      return of(this.branchesAxiosResponse);
    else if (path.includes(RepositoriesHttpServiceMock.mockReturn.branches.notFound))
      return of(this.repositoriesBranchesErrorResponse);
    else if (path.includes(RepositoriesHttpServiceMock.mockReturn.branches.error))
      return throwError(() => {
        return new HttpException('error', HttpStatus.BAD_REQUEST);
      });
    else if (path.includes('branches')) return of(this.branchesAxiosResponse);
    else if (path.includes('repositories')) return of(this.repositoriesAxiosResponse);
  }
}
