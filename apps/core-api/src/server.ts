import { join } from 'node:path'

import AutoLoad from '@fastify/autoload'
import cookie from '@fastify/cookie'
import cors from '@fastify/cors'
import Fastify from 'fastify'

import { app as AppPlugin } from './app'

const start = async () => {
  const app = Fastify({
    logger: {
      transport: {
        target: '@fastify/one-line-logger',
      },
    },
  })

  // Register the main application plugin
  await app.register(AppPlugin)

  // Register cookie plugin
  await app.register(cookie)

  // Register CORS plugin
  await app.register(cors, {
    origin: 'http://localhost:4000',
    credentials: true, // Allow cookies to be sent
  })

  // Autoload plugins
  await app.register(AutoLoad, {
    dir: join(__dirname, 'plugins'),
    options: {},
  })

  // Autoload routes
  await app.register(AutoLoad, {
    dir: join(__dirname, 'routes'),
    options: {},
  })

  try {
    await app.listen({ port: 3000 })
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

void start()
