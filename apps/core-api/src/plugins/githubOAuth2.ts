import oauthPlugin, { OAuth2Namespace } from '@fastify/oauth2'
import axios from 'axios'
import { FastifyPluginAsync } from 'fastify'
import fp from 'fastify-plugin'

declare module 'fastify' {
  interface FastifyInstance {
    githubOAuth2: OAuth2Namespace
  }
}

interface GitHubUserInfo {
  id: number
  login: string
  name: string
  email: string | null
}

interface GitHubEmailInfo {
  email: string
  primary: boolean
  verified: boolean
  visibility: 'public' | 'private' | null
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

      const { data: userInfo } = await axios.get<GitHubUserInfo>(
        'https://api.github.com/user',
        {
          headers: { Authorization: `Bearer ${token.access_token}` },
        },
      )

      let userEmail = userInfo.email
      // 사용자의 주 이메일이 비공개인 경우, 이메일 목록에서 가져옵니다.
      if (!userEmail) {
        const { data: emails } = await axios.get<GitHubEmailInfo[]>(
          'https://api.github.com/user/emails',
          {
            headers: { Authorization: `Bearer ${token.access_token}` },
          },
        )
        userEmail =
          emails.find((email) => email.primary && email.verified)?.email ?? null
      }

      if (!userEmail) {
        throw new Error('GitHub user email could not be retrieved.')
      }

      // DB에서 사용자 조회 또는 생성
      let user = await fastify.prisma.user.findUnique({
        where: { email: userEmail },
      })

      if (!user) {
        user = await fastify.prisma.user.create({
          data: {
            email: userEmail,
            name: userInfo.name || userInfo.login,
            provider: 'GITHUB',
          },
        })
      }

      // 사용자를 위한 JWT 생성
      const serviceToken = fastify.jwt.sign({ userId: user.id })

      reply.send({ serviceToken })
    } catch (error) {
      fastify.log.error(error)
      reply.status(500).send({ message: 'GitHub login failed' })
    }
  })
}

export default fp(githubOAuth2Plugin)
