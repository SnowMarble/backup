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
    "description": string | null
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

| name        | type   | required | description |
| ----------- | ------ | -------- | ----------- |
| name        | string | Y        | 앨범 이름   |
| description | string | N        | 앨범 설명   |
| categoryId  | number | N        | 카테고리 id |
| evnetDate   | string | N        | 이벤트 날짜 |

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
