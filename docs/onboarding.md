# Onboarding

처음 등록된 회원에게는 기본적인 정보를 입력하도록 안내합니다.

## Name

> 인증이 필요합니다.

```text
POST /onboarding/name
```

#### Request

```json
{
  "name": "string"
}
```

#### Response

no response, send 200 status code

---

## Create Family

> 인증이 필요합니다.

```text
POST /onboarding/create-family
```

#### Request

이름은 1~30 글자 사이입니다.

```json
{
  "name": "string"
}
```

#### Response

no response, send 200 statu code

---

## Family code

개발중
