import oauthPlugin, { OAuth2Namespace } from '@fastify/oauth2'
import axios from 'axios'
import { FastifyPluginAsync } from 'fastify'
import fp from 'fastify-plugin'

declare module 'fastify' {
  interface FastifyInstance {
    googleOAuth2: OAuth2Namespace
  }
}

interface GoogleUserInfo {
  email: string
  name: string
  picture: string
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
      const { token: googleToken } =
        await fastify.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(req)

      // Google 사용자 정보 가져오기
      const { data: userInfo } = await axios.get<GoogleUserInfo>(
        'https://www.googleapis.com/oauth2/v3/userinfo',
        {
          headers: {
            Authorization: `Bearer ${googleToken.access_token}`,
          },
        },
      )

      // DB에서 사용자 조회 또는 생성
      let user = await fastify.prisma.user.findUnique({
        where: { email: userInfo.email },
      })

      if (!user) {
        user = await fastify.prisma.user.create({
          data: {
            email: userInfo.email,
            name: userInfo.name,
            provider: 'GOOGLE',
          },
        })
      }

      // 사용자를 위한 JWT 생성
      const token = fastify.jwt.sign({ userId: user.id })

      // JWT를 쿠키에 담아 프론트엔드로 리디렉션
      reply
        .setCookie('auth_token', token, {
          path: '/',
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production', // 프로덕션에서는 true로 설정
        })
        .redirect('http://localhost:4000')
    } catch (error) {
      fastify.log.error(error)
      // 실패 시 에러 메시지와 함께 프론트엔드로 리디렉션할 수도 있음
      reply.redirect('http://localhost:4000/login-failed')
    }
  })
}

export default fp(googleOAuth2Plugin)
