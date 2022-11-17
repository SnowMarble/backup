# Story

## Create Story

> 인증 필요

```text
[post] /story
```

#### Request body

| name        | type   | required | description |
| ----------- | ------ | -------- | ----------- |
| albumId     | number | Y        | 앨범 id     |
| description | string | N        | 스토리 설명 |
| image       | string | Y        | 이미지 키   |

## Get today's story

> 인증 필요

```text
[get] /story/today
```

#### Response

| name              | type           | description             |
| ----------------- | -------------- | ----------------------- |
| users             | array          | 유저 목록               |
| users.id          | number         | 유저 id                 |
| users.name        | string         | 유저 이름               |
| users.image       | string         | 유저 이미지             |
| story             | array          | 스토리 목록             |
| story.id          | number         | 스토리 id               |
| story.userId      | number         | 스토리를 작성한 유저 id |
| story.description | string \| null | 스토리 설명             |
| story.image       | string         | 스토리 이미지           |
| story.createdAt   | string         | 스토리 생성 시간        |
| story.album       | string         | 스토리가 포함된 앨범    |

예시 응답

```json
{
  "users": [
    {
      "id": 763758,
      "name": "mee",
      "picture": "https://lh3.googleusercontent.com/a/ALm5wu0piWBsgYVxDQCFrL7OWeo_ftlw4uZ2uiVC9MUP=s96-c"
    }
  ],
  "story": [
    {
      "id": 11,
      "userId": 763758,
      "album": "Nov. 16",
      "createdAt": "2022-11-17T13:11:33.687Z",
      "description": "hope..",
      "image": "https://5gjwe7qbq8.apigw.gov-ntruss.com/sample/v1/upload/7f7cb5638b2a466ca9b1ad102c43f8b3?&f=59&a=474091749bcc41f30d6d394e057134b1"
    },
    {
      "id": 10,
      "userId": 763758,
      "album": "Nov. 16",
      "createdAt": "2022-11-17T13:09:55.580Z",
      "description": "lesgooo",
      "image": "https://5gjwe7qbq8.apigw.gov-ntruss.com/sample/v1/upload/49eea7595e76f15482914761934de8d8?&f=59&a=4d7cd472f25926ab6770cab4651322c4"
    }
  ]
}
```
