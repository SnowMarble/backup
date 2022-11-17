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
