import { FastifyPluginAsync } from 'fastify'

const root: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.get('/', async function (req, reply) {
    reply.send({ root: true, message: 'Welcome to the API!' })
  })
}

export default root
