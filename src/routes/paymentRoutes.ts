import { FastifyInstance } from "fastify";
import {
  createPayment,
  getPaymentById,
  getPaymentsByUserId,
} from "../controllers/paymentController";

async function paymentRoutes(fastify: FastifyInstance) {
  // Route to create a new payment
  fastify.post("/payments", createPayment);

  // Route to get a payment by its ID
  fastify.get("/payments/:id", getPaymentById);

  // Route to get all payments for a specific user by their user ID
  fastify.get("/users/:userId/payments", getPaymentsByUserId);
}

export default paymentRoutes;
