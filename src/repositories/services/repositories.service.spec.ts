import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { GitHubBranch } from '../clients/dtos/github-branch';
import { GitHubRepository } from '../clients/dtos/github-repository';
import { RepositoriesClient } from '../clients/repositories.client';
import { RepositoriesModule } from '../repositories.module';
import { RepositoriesResponse } from './entities/repositories.response';
import { RepositoriesService } from './repositories.service';

describe('RepositoriesService', () => {
  let service: RepositoriesService;
  let repositoriesClient: RepositoriesClient;

  const user = 'user';

  const gitHubRepository1: GitHubRepository = {
    name: 'name1',
    owner: {
      login: 'owner1',
    },
    branches_url: 'branches_url1',
    commits_url: 'commits_url1',
  };

  const gitHubRepository2: GitHubRepository = {
    name: 'name2',
    owner: {
      login: 'owner2',
    },
    branches_url: 'branches_url2',
    commits_url: 'commits_url2',
  };
  const gitHubRepositories: GitHubRepository[] = [gitHubRepository1, gitHubRepository2];

  const gitHubBranch: GitHubBranch = {
    name: 'branchName',
    commit: {
      sha: 'branchSha',
      url: 'branchUrl',
    },
    protected: false,
  };
  const repositories: RepositoriesResponse[] = [
    {
      name: gitHubRepository1.name,
      owner: gitHubRepository1.owner.login,
      branches: [
        {
          name: gitHubBranch.name,
          lastCommitSHA: gitHubBranch.commit.sha,
        },
      ],
    },
    {
      name: gitHubRepository2.name,
      owner: gitHubRepository2.owner.login,
      branches: [
        {
          name: gitHubBranch.name,
          lastCommitSHA: gitHubBranch.commit.sha,
        },
      ],
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [RepositoriesModule],
    }).compile();

    service = module.get<RepositoriesService>(RepositoriesService);
    repositoriesClient = module.get<RepositoriesClient>(RepositoriesClient);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('given user when get repositories then get repositories from client and the branches of each one of them', (done) => {
    const getRepositoriesClientSpy = jest.spyOn(repositoriesClient, 'getRepositories');
    getRepositoriesClientSpy.mockImplementationOnce(() => of(gitHubRepositories));
    const getBranchesClientSpy = jest.spyOn(repositoriesClient, 'getBranches');
    getBranchesClientSpy.mockImplementation(() => of([gitHubBranch]));

    service.getRepositories(user).subscribe((result) => {
      expect(getRepositoriesClientSpy).toHaveBeenCalledTimes(1);
      expect(getRepositoriesClientSpy).toHaveBeenCalledWith(user, undefined);

      expect(getBranchesClientSpy).toHaveBeenCalledTimes(gitHubRepositories.length);
      expect(getBranchesClientSpy.mock.calls).toEqual([[gitHubRepositories[0]], [gitHubRepositories[1]]]);

      expect(result).toEqual(repositories);

      done();
    });
  });
});
