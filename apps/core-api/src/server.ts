import { join } from 'node:path'

import AutoLoad from '@fastify/autoload'
import cookie from '@fastify/cookie'
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
