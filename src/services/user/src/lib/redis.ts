import Redis from "ioredis"
import { config } from "lib"

export const redis = new Redis(config.redisURI)
