import type Joi from 'joi'
import type { RequestHandler } from 'express'

export type Validation = {
  type: 'path' | 'body' | 'query' | 'params',
  body: { [key: string]: Joi.Schema }
}

export type Routers = {
  root: string
  routers: {
    path: string
    method:
    | 'all'
    | 'get'
    | 'post'
    | 'put'
    | 'delete'
    | 'patch'
    | 'options'
    | 'head'
    needAuth: boolean
    middlewares?: RequestHandler[]
    handler: RequestHandler
    validation?: Validation
  }[]
}
