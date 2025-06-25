import { FastifyPluginAsync } from "fastify";

const ping: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get("/ping", async (request, reply) => {
    return { msg: "pong" };
  });
};

export default ping;
