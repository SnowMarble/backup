# User

## Get family code

> 인증이 필요합니다.

family code는 1분 동안만 유효하며, 한 사용자가 다시 코드를 생성하면 이전에 생성한 코드는 삭제됩니다.

코드는 [/onboarding/family-code](onboarding?id=family-code)에서 사용합니다.

```text
GET /user/family-code
```

### Response

```json
{
  "code": "string"
}
```

## Get user info

> 인증이 필요합니다.

```text
GET /user/me
```

### Response

```json
{
    "name": string,
    "picture": string,
    "family": {
        "name": string,
        "memberCount": number
    }
}
```
