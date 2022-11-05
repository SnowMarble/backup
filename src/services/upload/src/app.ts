import cors from "cors"
import helmet from "helmet"
import express from "express"
import config from "lib/config"
import { readdirSync } from "fs"
import { join } from "path/posix"
import { randomBytes } from "crypto"
import { RabbitMQ, HttpError } from "lib"
import bearerToken from "express-bearer-token"

import { User } from 'interface/user'
import errorHandler from "./middlewares/error"
import validator from "./middlewares/validator"

import type { Application } from "express"
import type { Routers } from "./interface/app"
import type { Request, Response, NextFunction } from "express"

const identity = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.token) {
    throw new HttpError(401, "invalid token", "ERR_INVALID_TOKEN")
  }

  const correlationId = randomBytes(16).toString("hex")

  console.log(" [x] Requesting identity: " + correlationId)
  RabbitMQ.identityReplyHandlers.set(correlationId, ({ data }: { data: User }) => {
    req.user = data
    next()
  })

  const channel = await RabbitMQ.createChannel()
  await channel.assertQueue("user-identity")
  channel.sendToQueue(
    "user-identity",
    Buffer.from(req.token),
    {
      replyTo: 'user-identity-reply',
      correlationId,
    }
  )
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
      await RabbitMQ.userIdentityReply()
      await RabbitMQ.createDeaultCategories()
    })()
  }

  public listen(port = config.port): void {
    this.app.listen(port, () => {
      console.log(`Server is running on port ${port}`)
    })
  }
}
