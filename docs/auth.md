# Auth

사용자 인증에 관한 내용을 다룹니다.

## Login

```text
POST /auth/login
```

#### Request

구글 아이디 토큰을 전달합니다.

```json
{
  "idToken": "string"
}
```

#### Response

`onboarding`이 true이면 이름과 가족을 입력받도록 해주세요.

```json
{
  "onbaording": "boolean",
  "token": {
    "accessToken": "string",
    "refreshToken": "string"
  }
}
```

---

## Refresh token

> 리프레시 토큰으로 인증이 필요한 라우트입니다.

```text
POST /auth/refresh
```

#### Response

```json
{
  "onbaording": "boolean",
  "token": {
    "accessToken": "string",
    "refreshToken": "string"
  }
}
```
