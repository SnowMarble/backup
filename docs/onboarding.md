# Onboarding

처음 등록된 회원에게는 기본적인 정보를 입력하도록 안내합니다.

## Name

> 인증이 필요합니다.

```text
POST /onboarding/name
```

#### Request

| name | type   | required | description |
| ---- | ------ | -------- | ----------- |
| name | string | Y        |             |

#### Response

no response, send 200 status code

---

## Create Family

> 인증이 필요합니다.

```text
POST /onboarding/create-family
```

#### Request

| name | type   | required | description    |
| ---- | ------ | -------- | -------------- |
| name | string | Y        | 1~30 글자 사이 |

#### Response

no response, send 200 statu code

---

## Family code

> 인증이 필요합니다.

```text
POST /onboarding/family-code
```

#### Request

| name | type   | required | description |
| ---- | ------ | -------- | ----------- |
| code | string | Y        |             |

#### Response

```json
{
  "name": string, // family name
  "users": {
    "name": string,
    "picture": string
  }[]
}
```
