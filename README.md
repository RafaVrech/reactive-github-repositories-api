# Description

This API consumes GitHub APis and return repositories results in reactive style

## Installation

```bash
$ npm install
```

## Running the app
>If launching in *Development* or *Watch mode*: <br> Copy the *sample.env* file to the same directory and rename it to *.env*

#### Docker
```bash
$ cd .\docker
$ docker-compose up
```

#### Development
```bash
$ npm run start
```

#### Watch mode
```bash
$ npm run start:dev
```

#### Production mode
```bash
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

# REST API

The REST API endpoints can be found below

## Get repositories from user

### Request

`GET /user/:GitHubUsername/repositories`

| Query param | Default            | Values       | 
| ----------- | --------------- | --------- | 
| includeForks     | false          | true, false      | 

    curl -i -H 'Accept: application/json' http://localhost:8080/user/rafavrech/repositories

### Responses

##### Successes

    HTTP/1.1 200 OK
    Date: Sun, 08 Aug 2021 12:36:32 GMT
    Status: 200 OK
    Connection: close
    Content-Type: application/json
    Content-Length: X

    [
        {
            "name": "RepositoryName",
            "owner": "GitHubUserName",
            "branches": [
                {
                    "name": "master",
                    "lastCommitSHA": "03993b7cfd8f35ba64c9a06eb29e789ac415d155"
                }
            ]
        }
    ]

##### Errors

    HTTP/1.1 404 Not Found
    X-Powered-By: Express
    Content-Type: application/json; charset=utf-8
    Content-Length: 77
    Date: Mon, 09 Aug 2021 02:22:29 GMT
    Connection: keep-alive
    Keep-Alive: timeout=5
    
    {"status":404,"message":"Failed to find repositories for user 'rafavresdch'"}

<!-- tsk -->

    HTTP/1.1 406 Not Acceptable
    X-Powered-By: Express
    Content-Type: application/json; charset=utf-8
    Content-Length: 74
    ETag: W/"4a-Ftmm3wO09kfQ6hkEFAUIPYnYm98"
    Date: Mon, 09 Aug 2021 02:27:42 GMT
    Connection: keep-alive
    Keep-Alive: timeout=5
    
    {"status":406,"message":"Accept type 'application/test' is not supported"}

## Stay in touch

- Author - [Rafael Vrech](rafavrech@gmail.com)

