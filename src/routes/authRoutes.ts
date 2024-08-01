import { FastifyInstance } from "fastify";
import { signUp, login } from "../controllers/authController";

async function authRoutes(fastify: FastifyInstance) {
  fastify.post("/signup", signUp);

  fastify.post("/login", login);
}
export default authRoutes;
