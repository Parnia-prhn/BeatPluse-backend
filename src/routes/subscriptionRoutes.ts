import { FastifyInstance } from "fastify";
import {
  createSubscription,
  getSubscriptionById,
  updateSubscriptionStatus,
  deleteSubscription,
  getSubscriptionsByUserId,
} from "../controllers/SubscriptionController";

async function subscriptionRoutes(fastify: FastifyInstance) {
  fastify.post("/subscriptions/create", createSubscription);

  fastify.get("/subscriptions/:id", getSubscriptionById);

  fastify.put("/subscriptions/update/:id/status", updateSubscriptionStatus);

  fastify.delete("/subscriptions/delete/:id", deleteSubscription);

  fastify.get("/users/:userId/subscriptions", getSubscriptionsByUserId);
}

export default subscriptionRoutes;
