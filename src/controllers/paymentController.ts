import { FastifyRequest as Request, FastifyReply as Reply } from "fastify";
import { Payment } from "../database/models/Payment";
import { IPayment } from "../database/interfaces/IPayment";
async function createPayment(req: Request, reply: Reply) {
  const { userId, amount, currency, transactionDate } = req.body as IPayment;

  try {
    const newPayment = new Payment({
      userId,
      amount,
      currency,
      transactionDate,
    });

    const savedPayment = await newPayment.save();
    reply.status(201).send(savedPayment);
  } catch (error) {
    reply.status(500).send({ error: "Internal server error" });
  }
}

async function getPaymentById(req: Request, reply: Reply) {
  const paymentId = (req.params as { id: string }).id;

  try {
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      reply.status(404).send({ error: "Payment not found" });
      return;
    }

    reply.status(200).send(payment);
  } catch (error) {
    reply.status(500).send({ error: "Internal server error" });
  }
}

async function getPaymentsByUserId(req: Request, reply: Reply) {
  const userId = (req.params as { userId: string }).userId;

  try {
    const payments = await Payment.find({ userId });
    if (!payments.length) {
      reply.status(404).send({ error: "No payments found for this user" });
      return;
    }

    reply.status(200).send(payments);
  } catch (error) {
    reply.status(500).send({ error: "Internal server error" });
  }
}

export { createPayment, getPaymentById, getPaymentsByUserId };
