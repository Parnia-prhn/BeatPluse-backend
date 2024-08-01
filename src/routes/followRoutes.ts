import { FastifyInstance } from "fastify";
import {
  FollowUserController,
  getFollowController,
  getAllFollowsController,
} from "../controllers/followController";

async function followRoutes(fastify: FastifyInstance) {
  fastify.post("/follow/:followerId/:followedId", FollowUserController);

  fastify.get("/follow/:followId", getFollowController);

  fastify.get("/follows", getAllFollowsController);
}

export default followRoutes;
