import oauthPlugin, { OAuth2Namespace } from '@fastify/oauth2'
import { FastifyPluginAsync } from 'fastify'
import fp from 'fastify-plugin'

declare module 'fastify' {
  interface FastifyInstance {
    githubOAuth2: OAuth2Namespace
  }
}

const githubOAuth2Plugin: FastifyPluginAsync = async (fastify) => {
  fastify.register(oauthPlugin, {
    name: 'githubOAuth2',
    scope: ['read:user', 'user:email'], // GitHub는 사용자 정보와 이메일을 위해 별도의 scope가 필요합니다.
    credentials: {
      client: {
        id: process.env.GITHUB_CLIENT_ID as string,
        secret: process.env.GITHUB_CLIENT_SECRET as string,
      },
      auth: oauthPlugin.GITHUB_CONFIGURATION,
    },
    startRedirectPath: '/oauth2/github',
    callbackUri: 'http://localhost:3000/oauth2/github/callback',
  })

  fastify.get('/oauth2/github/callback', async (req, reply) => {
    try {
      const { token } =
        await fastify.githubOAuth2.getAccessTokenFromAuthorizationCodeFlow(req)

      // TODO: 다음 태스크에서 사용자 정보 조회 및 JWT 발급 예정
      reply.send({ accessToken: token.access_token })
    } catch (error) {
      fastify.log.error(error)
      reply.status(500).send({ message: 'GitHub login failed' })
    }
  })
}

export default fp(githubOAuth2Plugin)
