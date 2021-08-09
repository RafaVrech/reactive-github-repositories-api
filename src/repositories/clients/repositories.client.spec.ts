import { EnvironmentConfig } from '@config/env.config';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { catchError, of, throwError } from 'rxjs';
import { GetRepositoriesQuery } from '../controllers/queries/get-repositories.query';
import { RepositoriesModule } from '../repositories.module';
import { RepositoriesResponse } from '../services/entities/repositories.response';
import { RepositoriesService } from '../services/repositories.service';
import { RepositoriesClient } from './repositories.client';
import { AxiosResponse } from 'axios';
import { GitHubResponse } from './dtos/github-response';
import { GitHubRepository } from './dtos/github-repository';
import { HttpException, HttpStatus } from '@nestjs/common';
import { GitHubBranch } from './dtos/github-branch';

describe('RepositoriesClient', () => {
  let client: RepositoriesClient;
  let httpService: HttpService;
  let config: ConfigService;

  let getSpy: jest.SpyInstance;
  let configSpy: jest.SpyInstance;

  const user = 'username';
  const url = 'http://url/';

  const axiosResponse: AxiosResponse = {
    status: HttpStatus.OK,
    config: {},
    headers: {},
    statusText: '',
    data: {
      items: [],
    } as GitHubResponse,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [RepositoriesModule],
      controllers: [],
      providers: [],
    }).compile();

    client = module.get<RepositoriesClient>(RepositoriesClient);
    Object.defineProperty(client, 'baseGitHubUrl', { value: url });
    httpService = module.get<HttpService>(HttpService);
    config = module.get<ConfigService>(ConfigService);

    getSpy = jest.spyOn(httpService, 'get');
  });

  it('should be defined', () => {
    expect(client).toBeDefined();
  });

  describe('RepositoriesClient - GET repositories', () => {
    const gitHubRepositories: GitHubRepository[] = [
      {
        name: 'name',
        owner: {
          login: 'owner',
        },
        branches_url: '',
        commits_url: '',
      },
    ];

    beforeEach(async () => {
      axiosResponse.data.items = gitHubRepositories;
    });

    it('given username when get repositories should call get repositories from github api and return mapped repositories', (done) => {
      const repositoriesUrl = `${url}/search/repositories?q=user:${user}+fork:false`;

      getSpy.mockReturnValueOnce(of(axiosResponse));
      configSpy = jest.spyOn(config, 'get');
      configSpy.mockReturnValueOnce(url);

      client.getRepositories(user).subscribe((repositoriesReturn) => {
        expect(repositoriesReturn).toEqual(gitHubRepositories);
        expect(getSpy).toHaveBeenCalledTimes(1);
        expect(getSpy).toHaveBeenCalledWith(repositoriesUrl);
        done();
      });
    });

    it('given username and include forks trye when get repositories should call get repositories from github api and return mapped repositories', (done) => {
      const repositoriesUrl = `${url}/search/repositories?q=user:${user}+fork:true`;

      getSpy.mockReturnValueOnce(of(axiosResponse));
      configSpy = jest.spyOn(config, 'get');
      configSpy.mockReturnValueOnce(url);

      client.getRepositories(user, true).subscribe((repositoriesReturn) => {
        expect(repositoriesReturn).toEqual(gitHubRepositories);
        expect(getSpy).toHaveBeenCalledTimes(1);
        expect(getSpy).toHaveBeenCalledWith(repositoriesUrl);
        done();
      });
    });

    it('given error when get repositories then throw not found http exception', (done) => {
      const repositoriesUrl = `${url}/search/repositories?q=user:${user}+fork:false`;
      const axiosThrownException = new HttpException('Error thrown by axios', HttpStatus.BAD_REQUEST);
      const expectedException = new HttpException(`Failed to find repositories for user '${user}'`, HttpStatus.NOT_FOUND);

      getSpy.mockReturnValueOnce(throwError(() => axiosThrownException));
      configSpy = jest.spyOn(config, 'get');
      configSpy.mockReturnValueOnce(url);

      client.getRepositories(user).subscribe({
        error: (error) => {
          expect(getSpy).toHaveBeenCalledTimes(1);
          expect(getSpy).toHaveBeenCalledWith(repositoriesUrl);
          expect(error).toEqual(expectedException);
          done();
        },
      });
    });
  });

  describe('RepositoriesClient - GET branches', () => {
    const gitHubBranches: GitHubBranch[] = [
      {
        name: 'name',
        commit: {
          sha: 'sha',
          url: 'url',
        },
        protected: false,
      },
    ];
    
    beforeEach(async () => {
      axiosResponse.data = gitHubBranches;
    });

    const repository: GitHubRepository = {
      name: 'name',
      owner: {
        login: 'owner',
      },
      branches_url: 'url',
      commits_url: 'url',
    };
    const branchesUrl = `${url}/repos/${repository.owner.login}/${repository.name}/branches`;

    it('given repository when get branches should call get branches from github api and return mapped branches', (done) => {
      getSpy.mockReturnValueOnce(of(axiosResponse));
      configSpy = jest.spyOn(config, 'get');
      configSpy.mockReturnValueOnce(url);

      client.getBranches(repository).subscribe((branchesReturn) => {
        expect(branchesReturn).toEqual(gitHubBranches);
        expect(getSpy).toHaveBeenCalledTimes(1);
        expect(getSpy).toHaveBeenCalledWith(branchesUrl);
        done();
      });
    });

    it('given error when get branches then throw not found http exception', (done) => {
      const axiosThrownException = new HttpException('Error thrown by axios', HttpStatus.BAD_REQUEST);
      const expectedException = new HttpException(
        `Failed to find branches for repository '${repository.name}' of user '${repository.owner.login}'`,
        HttpStatus.NOT_FOUND,
      );

      getSpy.mockReturnValueOnce(throwError(() => axiosThrownException));
      configSpy = jest.spyOn(config, 'get');
      configSpy.mockReturnValueOnce(url);

      client.getBranches(repository).subscribe({
        error: (error) => {
          expect(getSpy).toHaveBeenCalledTimes(1);
          expect(getSpy).toHaveBeenCalledWith(branchesUrl);
          expect(error).toEqual(expectedException);
          done();
        },
      });
    });
  });
});
