import config from "./config"
import amqplib from "amqplib"

let connection: amqplib.Connection

export default async () => {
  if (!connection) {
    connection = await amqplib.connect(config.rabbitMQURI)
  }

  return connection
}
