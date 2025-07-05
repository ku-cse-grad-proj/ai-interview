import { FastifyPluginAsync } from 'fastify'

const ping: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.get('/ping', async () => {
    return { msg: 'pong' }
  })
}

export default ping
