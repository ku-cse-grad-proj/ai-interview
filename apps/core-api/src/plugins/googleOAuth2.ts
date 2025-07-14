import oauthPlugin, { OAuth2Namespace } from '@fastify/oauth2'
import { FastifyPluginAsync } from 'fastify'
import fp from 'fastify-plugin'

declare module 'fastify' {
  interface FastifyInstance {
    googleOAuth2: OAuth2Namespace
  }
}

const googleOAuth2Plugin: FastifyPluginAsync = async (fastify) => {
  fastify.register(oauthPlugin, {
    name: 'googleOAuth2',
    scope: ['profile', 'email'],
    credentials: {
      client: {
        id: process.env.GOOGLE_CLIENT_ID as string,
        secret: process.env.GOOGLE_CLIENT_SECRET as string,
      },
      auth: oauthPlugin.GOOGLE_CONFIGURATION,
    },
    startRedirectPath: '/oauth2/google',
    callbackUri: 'http://localhost:3000/oauth2/google/callback', // 127.0.0.1 에서 시도시 실패
    callbackUriParams: {},
    cookie: {
      secure: false, // 개발 환경에서는 false로 설정
    },
  })

  fastify.get('/oauth2/google/callback', async (req, reply) => {
    try {
      const { token } =
        await fastify.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(req)

      console.log(token.access_token)

      // if later need to refresh the token this can be used
      // const { token: newToken } = await this.getNewAccessTokenUsingRefreshToken(token)

      reply.send({ access_token: token.access_token })
    } catch (error) {
      fastify.log.error(error)
      reply.status(500).send({ message: 'Google login failed' })
    }
  })
}

export default fp(googleOAuth2Plugin)
