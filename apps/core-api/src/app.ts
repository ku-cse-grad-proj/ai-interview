import { FastifyPluginAsync, FastifyServerOptions } from 'fastify'
import fp from 'fastify-plugin'

export type AppOptions = FastifyServerOptions & Partial<unknown>

const app: FastifyPluginAsync<AppOptions> = async (): Promise<void> => {
  // All app-level plugins should be registered here
}

export default fp(app)
export { app }
