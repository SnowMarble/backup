import 'dotenv/config'

const check = (key: string, defaultValue?: string): string => {
  if (typeof process.env[key] === 'undefined') {
    if (typeof defaultValue === 'undefined') {
      throw new Error(`${key} is not defined in .env`)
    }
    return defaultValue
  }
  return process.env[key] as string
}

export default {
  port: check('PORT', '3000'),

  jwtSecret: check('JWT_SECRET'),
  jwtAccessLife: check('JWT_ACCESS_LIFE', '1d'),
  jwtRefreshLife: check('JWT_REFRESH_LIFE', '1y'),

  rabbitMQURI: check('RABBITMQ_URI'),
  redisURI: check('USER_REDIS_URI'),

  googleClientIds: check("GOOGLE_CLIENT_IDS", "").split(",").filter(Boolean),
}
