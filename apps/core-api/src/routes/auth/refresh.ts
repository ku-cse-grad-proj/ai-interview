import { FastifyPluginAsync } from 'fastify'
import fp from 'fastify-plugin'

interface JWTPayload {
  userId: string
}

const authRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post('/auth/refresh', async (request, reply) => {
    try {
      // 1. 쿠키에서 리프레시 토큰을 가져와 검증합니다.
      //    onlyCookie: true 옵션으로 쿠키만 사용하도록 강제합니다.
      const userPayload = await request.jwtVerify<JWTPayload>({
        onlyCookie: true,
      })

      // 2. DB에서 사용자가 여전히 유효한지 확인합니다.
      const user = await fastify.prisma.user.findUnique({
        where: { id: userPayload.userId },
      })

      if (!user) {
        reply.clearCookie('refresh_token')
        return reply.status(401).send({ message: 'Unauthorized' })
      }

      // 3. 새로운 Access Token을 발급합니다.
      const accessToken = await reply.jwtSign(
        { userId: user.id },
        { expiresIn: '15m' },
      )
      return { accessToken }
    } catch (err) {
      // 토큰이 유효하지 않거나 만료된 경우
      fastify.log.error(err)
      reply.clearCookie('refresh_token')
      return reply.status(401).send({ message: 'Unauthorized' })
    }
  })
}

export default fp(authRoutes)
