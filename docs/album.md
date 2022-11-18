# Album

## get album

> 인증 필요

```text
get /album
```

#### Request query

| name     | type                            | required | description              |
| -------- | ------------------------------- | -------- | ------------------------ |
| sortType | lastViewed \| updatedAt \| name | Y        | 정렬 기준                |
| sort     | asc \| desc                     | N        | 정렬 방식 (default: asc) |

### Response

```json
{
    "id": number,
    "name": string,
    "categoryId": string,
    "description": string | null,
    "thumbnail": string | null,
    "revealsAt": string | null,
}[]

```

example response

```json
[
  {
    "id": 2,
    "name": "birth day",
    "description": null
  },
  {
    "id": 3,
    "name": "foo album",
    "description": null
  },
  {
    "id": 4,
    "name": "foo album",
    "description": null
  }
]
```

## create album

> 인증 필요

```text
post /album
```

#### Request body

| name        | type   | required | description                                   |
| ----------- | ------ | -------- | --------------------------------------------- |
| name        | string | Y        | 앨범 이름                                     |
| description | string | N        | 앨범 설명                                     |
| categoryId  | number | N        | 카테고리 id                                   |
| evnetDate   | string | N        | 이벤트 날짜                                   |
| thumbnail   | string | N        | 썸네일 이미지 키. 없으면 기본 이미지로 저장됨 |
| revealsAt   | string | N        | 공개 날짜. 캡슐을 생성할 때 전달해 주세요.    |

#### Response

```json
{
    "id": number,
    "name": string,
    "description": string | null
}
```

example response

```json
{
  "id": 5,
  "name": "foo album",
  "description": null
}
```

### get album detail

> 인증 필요

```text
[get] /album/:id
```

#### Response

#### 200

```json
{
  "id": number,
  "createdAt": string,
  "Category": {
    "id": number,
    "name": string
  },
  "name": string,
  "evnetDate": string,
  "description": string | null,
  "Story": {
    "id": number,
    "image": string,
    "description": string | null,
    "createdAt": string
  }[],
  "contributors": {
    "id": number,
    "name": string,
    "image": string
  }[]
}
```

#### 404

아직 공개되지 않은 앨범(캡슐)

```json
{
  "message": "Album is not found or not revealed",
  "code": "ERR_ALBUM_NOT_FOUND",
  "revealsAt": string
}
```

example response

```json
{
  "id": 1,
  "createdAt": "2022-11-07T23:37:12.765Z",
  "Category": {
    "id": 1,
    "name": "Daily"
  },
  "name": "foo album",
  "evnetDate": "2022-11-13T15:00:00.000Z",
  "description": null,
  "Story": [
    {
      "id": 1,
      "image": "http://localhost:3002/upload/00aa497d957da42723b9d780e291bfc4?&f=13&a=400571306137d40a8290d806982bc041",
      "userId": 329500,
      "createdAt": "2022-11-07T23:38:14.196Z",
      "description": "lovely cat!!"
    },
    {
      "id": 2,
      "image": "http://localhost:3002/upload/7822332f9226fb1918ebeb5a1e1afa95?&f=13&a=8b78446582db0f2a5c2dfd0cf42894c2",
      "userId": 688617,
      "createdAt": "2022-11-08T01:19:12.044Z",
      "description": "shiba"
    },
    {
      "id": 3,
      "image": "http://localhost:3002/upload/7822332f9226fb1918ebeb5a1e1afa95?&f=13&a=bac59cd89785b3a9261ddddb0058f046",
      "userId": 688617,
      "createdAt": "2022-11-08T01:21:13.270Z",
      "description": "shiba"
    }
  ],
  "contributors": [
    {
      "id": 329500,
      "name": "3indblown leaf",
      "picture": "https://lh3.googleusercontent.com/a/ALm5wu0piWBsgYVxDQCFrL7OWeo_ftlw4uZ2uiVC9MUP=s96-c"
    },
    {
      "id": 688617,
      "name": "leafy",
      "picture": "https://lh3.googleusercontent.com/a/ALm5wu3pJ9JcxOpQmpQ2Z4LHKFfvzNIdyX61kliIbfbM=s96-c"
    }
  ]
}
```
