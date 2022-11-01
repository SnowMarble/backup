import { HttpError } from 'lib/error'

import type { Request, Response, NextFunction } from 'express'

export default (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof HttpError) {
    res.status(err.status).json({
      code: err.code,
      message: err.message,
    })
  } else {
    console.log(err)
    res.status(500).json({
      code: 'ERR_SERVER',
      message: 'Unexpected error occurred. Please try again later.',
    })
  }
}
