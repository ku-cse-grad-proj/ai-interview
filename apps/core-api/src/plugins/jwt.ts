import jwt from '@fastify/jwt'
import { FastifyPluginAsync } from 'fastify'
import fp from 'fastify-plugin'

const jwtPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.register(jwt, {
    secret: process.env.JWT_SECRET as string,
    cookie: {
      cookieName: 'refresh_token',
      signed: false,
    },
  })
}

export default fp(jwtPlugin)
