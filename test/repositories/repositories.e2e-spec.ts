import { ErrorHandlingConfig } from '@config/exception/error.handling.config';
import { HttpService } from '@nestjs/axios';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { RepositoriesResponse } from '@src/repositories/services/entities/repositories.response';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { RepositoriesHttpServiceMock } from './mocks/http-service.mock';

describe('RepositoriesController (e2e)', () => {
  let app: INestApplication;
  let httpService: HttpService;
  jest.setTimeout(9999999);

  const repositories: RepositoriesResponse[] = [
    {
      name: 'name1',
      owner: 'owner1',
      branches: [
        {
          name: 'branchName',
          lastCommitSHA: 'branchSha',
        },
      ],
    },
    {
      name: 'name2',
      owner: 'owner2',
      branches: [
        {
          name: 'branchName',
          lastCommitSHA: 'branchSha',
        },
      ],
    },
  ];

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(HttpService)
      .useClass(RepositoriesHttpServiceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    httpService = moduleFixture.get<HttpService>(HttpService);
    app.useGlobalFilters(new ErrorHandlingConfig());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /user/:username/repositories', () => {
    it('given username should return user repositories', () => {
      return request(app.getHttpServer())
        .get(`/user/${RepositoriesHttpServiceMock.mockReturn.repositories.success}/repositories`)
        .expect(HttpStatus.OK)
        .expect(JSON.stringify(repositories));
    });

    it('given invalid username should return repositories not found error', () => {
      return request(app.getHttpServer())
        .get(`/user/${RepositoriesHttpServiceMock.mockReturn.repositories.notFound}/repositories`)
        .expect(HttpStatus.NOT_FOUND)
        .expect({
          status: HttpStatus.NOT_FOUND,
          message: "Failed to find repositories for user 'repositoriesNotFound'",
        });
    });

    it('given error getting user branches should return branch not found error', () => {
      return request(app.getHttpServer())
        .get(`/user/${RepositoriesHttpServiceMock.mockReturn.branches.notFound}/repositories`)
        .expect(HttpStatus.NOT_FOUND)
        .expect({
          status: HttpStatus.NOT_FOUND,
          message: "Failed to find branches for repository 'branchesError' of user 'owner1'",
        });
    });

    it('given invalid Access header should return type not supported error', () => {
      return request(app.getHttpServer())
        .get(`/user/${RepositoriesHttpServiceMock.mockReturn.repositories.success}/repositories`)
        .set('Accept', 'application/notAccepted')
        .expect(HttpStatus.NOT_ACCEPTABLE)
        .expect({
          status: HttpStatus.NOT_ACCEPTABLE,
          message: "Accept type 'application/notAccepted' is not supported",
        });
    });

    it('given valid Access header should return success', () => {
      return request(app.getHttpServer())
        .get(`/user/${RepositoriesHttpServiceMock.mockReturn.repositories.success}/repositories`)
        .set('Accept', 'application/json')
        .expect(HttpStatus.OK)
        .expect(JSON.stringify(repositories));
    });
  });
});
