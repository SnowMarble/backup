import cors from "cors"
import helmet from "helmet"
import express from "express"
import config from "lib/config"
import { readdirSync } from "fs"
import { join } from "path/posix"
import { randomBytes } from "crypto"
import { amqp, HttpError } from "lib"
import bearerToken from "express-bearer-token"

import { createCategoryMQ } from "./routers/category/create"

import errorHandler from "./middlewares/error"
import validator from "./middlewares/validator"

import type { Application } from "express"
import type { User } from "interface/user"
import type { Routers } from "./interface/app"
import type { Request, Response, NextFunction } from "express"

interface Identity {
  error?: {
    code: string
    message: string
    status: number
  }
  data?: User
}

const identity = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.token) {
    throw new HttpError(401, "invalid token", "ERR_INVALID_TOKEN")
  }

  const queue = "user-identity"
  const replyQueue = `user-identity-${randomBytes(16).toString("hex")}`

  const connect = await amqp()
  const channel = await connect.createChannel()
  const replyChannel = await connect.createChannel()

  channel.sendToQueue(queue, Buffer.from(req.token), {
    replyTo: replyQueue,
  })

  await channel.assertQueue(replyQueue)
  replyChannel.consume(replyQueue, (msg) => {
    if (msg) {
      try {
        const idendity: Identity = JSON.parse(msg.content.toString())

        if (idendity.error) {
          replyChannel.ack(msg)
          throw new HttpError(
            idendity.error.status,
            idendity.error.message,
            idendity.error.code
          )
        }

        if (idendity.data) {
          replyChannel.ack(msg)
          req.user = idendity.data
        }
        next()
      } catch (error) {
        next(error)
      }
    }
  })
}

export default class {
  public app: Application

  constructor() {
    this.app = express()
    this.initializeMiddlewares()
    this.initializeMQ()
    this.initializeRouters()
    this.initializeErrorHandler()
  }

  private errorWrapper(
    handler: (
      req: Request,
      res: Response,
      next: NextFunction
    ) => Promise<void> | void
  ) {
    return (req: Request, res: Response, next: NextFunction) => {
      Promise.resolve(handler(req, res, next)).catch(next)
    }
  }

  private initializeMiddlewares(): void {
    this.app.use(cors())
    this.app.use(helmet())
    this.app.use(
      bearerToken({
        reqKey: "token",
        headerKey: "Bearer",
      })
    )
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: true }))
  }

  private initializeRouters(): void {
    ; (async () => {
      const routerPath = join(__dirname, "routers")
      const servicePath = (name: string) => join(routerPath, name, "index")

      const roots = readdirSync(routerPath, { withFileTypes: true })

      for (const root of roots) {
        if (!root.isDirectory()) {
          continue
        }

        const { default: service } = require(servicePath(root.name))
        for (const {
          method,
          path,
          middlewares = [],
          handler,
          needAuth,
          validation,
        } of (service as Routers).routers) {
          this.app[method](join(service.root, path), [
            ...(needAuth ? [this.errorWrapper(identity)] : []),
            ...(validation ? [this.errorWrapper(validator(validation))] : []),
            ...middlewares.map(this.errorWrapper),
            this.errorWrapper(handler),
          ])
        }
      }
    })()
  }

  private initializeErrorHandler(): void {
    this.app.use(errorHandler)
  }

  private initializeMQ(): void {
    ; (async () => {
      await createCategoryMQ()
    })()
  }

  public listen(port = config.port): void {
    this.app.listen(port, () => {
      console.log(`Server is running on port ${port}`)
    })
  }
}
