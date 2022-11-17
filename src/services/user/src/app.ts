import cors from "cors"
import helmet from "helmet"
import express from "express"
import config from "lib/config"
import { readdirSync } from "fs"
import { join } from "path/posix"
import { RabbitMQ, prisma, redis } from "lib"
import bearerToken from "express-bearer-token"
import { createPrismaRedisCache } from "prisma-redis-middleware";

import identity from "./middlewares/identity"
import errorHandler from "./middlewares/error"
import validator from "./middlewares/validator"

import { Prisma } from "generated/client"
import type { Application } from "express"
import type { Routers } from "./interface/app"
import type { Request, Response, NextFunction } from "express"

export default class {
  public app: Application

  constructor() {
    this.app = express()
    this.initializeMiddlewares()
    this.initializeRabbitMQ()
    this.initializeRouters()
    this.initializeErrorHandler()
    this.initializePrismaRedisCache()
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
  }

  private initializeErrorHandler(): void {
    this.app.use(errorHandler)
  }

  private initializeRabbitMQ(): void {
    ; (async () => {
      await RabbitMQ.userIdentity()
      await RabbitMQ.userInfoReply()
    })()
  }

  private initializePrismaRedisCache(): void {
    // const cacheMiddleware: Prisma.Middleware = createPrismaRedisCache({
    //   storage: {
    //     type: "redis",
    //     options: {
    //       client: redis,
    //       invalidation: { referencesTTL: 60 * 60 * 5 }
    //     }
    //   },
    //   cacheTime: 60 * 60 * 5, // 5 hours

    //   onHit: (key: string): void => {
    //     console.log("Cache hit 🪄  " + key);
    //   },
    //   onMiss: (key: string): void => {
    //     console.log("Cache miss 📎 " + key);
    //   },
    //   onError: (key: string): void => {
    //     console.log("Cache error! 🛑  " + key);
    //   },
    // })

    // prisma.$use(cacheMiddleware)
  }

  public listen(port = config.port): void {
    this.app.listen(port, () => {
      console.log(`Server is running on port ${port}`)
    })
  }
}
