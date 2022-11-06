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
  port: check('PORT'),

  NCP_ACCESS_KEY: check('NCP_ACCESS_KEY'),
  NCP_SECRET_KEY: check('NCP_SECRET_KEY'),

  rabbitMQURI: check('RABBITMQ_URI'),
}
