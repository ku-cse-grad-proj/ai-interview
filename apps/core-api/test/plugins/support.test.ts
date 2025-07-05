import * as assert from 'node:assert'
import { test } from 'node:test'

import Fastify from 'fastify'

import Support from '../../src/plugins/support'

test('support works standalone', async () => {
  const fastify = Fastify()
  void fastify.register(Support)
  await fastify.ready()

  assert.equal(fastify.someSupport(), 'hugs')
})
