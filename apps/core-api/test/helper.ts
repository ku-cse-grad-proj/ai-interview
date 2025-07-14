// This file contains code that we reuse between our tests.
import * as test from 'node:test'

import cookie from '@fastify/cookie'
import Fastify from 'fastify'
import fp from 'fastify-plugin'

import App from '../src/app'
// Import plugins
import googleOAuth2Plugin from '../src/plugins/googleOAuth2'
import jwtPlugin from '../src/plugins/jwt'
import prismaPlugin from '../src/plugins/prisma'
import sensiblePlugin from '../src/plugins/sensible'
import supportPlugin from '../src/plugins/support'
// Import routes
import exampleRoutes from '../src/routes/example'
import pingRoute from '../src/routes/ping'
import rootRoute from '../src/routes/root'

export type TestContext = {
  after: typeof test.after
}

// Fill in this config with all the configurations
// needed for testing the application
function config() {
  return {}
}

// Automatically build and tear down our instance
async function build(t: TestContext) {
  const app = Fastify()

  // Register plugins
  await app.register(cookie)
  await app.register(prismaPlugin)
  await app.register(jwtPlugin)
  await app.register(sensiblePlugin)
  await app.register(supportPlugin)
  await app.register(googleOAuth2Plugin)

  // Register the main application plugin
  await app.register(fp(App), config())

  // Register routes
  await app.register(rootRoute)
  await app.register(pingRoute)
  await app.register(exampleRoutes, { prefix: '/example' })

  // Tear down our app after we are done
  t.after(() => app.close())

  await app.ready()

  return app
}

export { config, build }
