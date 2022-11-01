import { verify, HttpError, issue as issueToken } from 'lib'

import type { Request, Response } from 'express';

export default async (req: Request, res: Response) => {
  const refreshToken = req.token;

  if (!refreshToken) {
    throw new HttpError(400, 'no refresh token', 'ERR_NO_REFRESH_TOKEN');
  }

  const payload = verify(refreshToken, true);

  return res.json({
    token: issueToken(payload.id, payload.onboarding),
    onboarding: payload.onboarding
  })
}
