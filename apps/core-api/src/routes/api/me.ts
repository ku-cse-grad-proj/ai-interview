import { FastifyPluginAsync } from 'fastify'
import fp from 'fastify-plugin'

const meRoute: FastifyPluginAsync = async (fastify) => {
  fastify.get(
    '/api/me',
    {
      onRequest: [fastify.authenticate],
    },
    async (request, reply) => {
      // The 'authenticate' hook has already verified the token
      // and attached the payload to request.user
      const { userId } = request.user

      const user = await fastify.prisma.user.findUnique({
        where: { id: userId },
        // Exclude sensitive data like password if you add it later
        select: {
          id: true,
          email: true,
          name: true,
          provider: true,
          createdAt: true,
          updatedAt: true,
        },
      })

      if (!user) {
        return reply.status(404).send({ message: 'User not found' })
      }

      return user
    },
  )
}

export default fp(meRoute)
