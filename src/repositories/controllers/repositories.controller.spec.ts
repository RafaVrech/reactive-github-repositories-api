import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { RepositoriesModule } from '../repositories.module';
import { RepositoriesResponse } from '../services/entities/repositories.response';
import { RepositoriesService } from '../services/repositories.service';
import { GetRepositoriesQuery } from './queries/get-repositories.query';
import { RepositoriesController } from './repositories.controller';

describe('RepositoriesController', () => {
  let controller: RepositoriesController;
  let repositoriesService: RepositoriesService;

  let getRepositoriesSpy: jest.SpyInstance;

  const query: GetRepositoriesQuery = {
    includeForks: true,
  };

  const user = 'username';

  const repositories: RepositoriesResponse[] = [
    {
      name: 'name',
      owner: 'owner',
      branches: [
        {
          name: 'name',
          lastCommitSHA: 'sha',
        },
      ],
    },
  ];


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [RepositoriesModule],
      controllers: [],
      providers: [],
    }).compile();

    controller = module.get<RepositoriesController>(RepositoriesController);
    repositoriesService = module.get<RepositoriesService>(RepositoriesService);

    getRepositoriesSpy = jest.spyOn(repositoriesService, 'getRepositories');
    getRepositoriesSpy.mockReturnValueOnce(of(repositories));
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('given username when get all repositories should get repositories from service', (done) => {
    controller.findAll(user).subscribe((repositoriesReturn) => {
      expect(repositoriesReturn).toEqual(repositories);
      expect(getRepositoriesSpy).toHaveBeenCalledTimes(1);
      expect(getRepositoriesSpy).toHaveBeenCalledWith(user, undefined);
      done();
    });
  });

  it('given username and include forks query when get all repositories should get repositories from service', (done) => {
    controller.findAll(user, query).subscribe((repositoriesReturn) => {
      expect(repositoriesReturn).toEqual(repositories);
      expect(getRepositoriesSpy).toHaveBeenCalledTimes(1);
      expect(getRepositoriesSpy).toHaveBeenCalledWith(user, query);
      done();
    });
  });
});
