import { FastifyRequest as Request, FastifyReply as Reply } from "fastify";
import { ISubscription } from "../database/interfaces/ISubscription";
import { Subscription } from "../database/models/Subscription";

async function createSubscription(req: Request, reply: Reply) {
  const { userId, type, startDate, endDate } = req.body as ISubscription;
  try {
    const newSubscription = new Subscription({
      userId,
      type,
      status: "active",
      startDate,
      endDate,
      isDeleted: false,
    });

    const savedSubscription = await newSubscription.save();
    reply.status(201).send(savedSubscription);
  } catch (error) {
    reply.status(500).send({ error: "Internal server error" });
  }
}

async function getSubscriptionById(req: Request, reply: Reply) {
  const subscriptionId = (req.params as { id: string }).id;
  try {
    const subscription = await Subscription.findById(subscriptionId);
    if (!subscription || subscription.isDeleted) {
      reply.status(404).send({ error: "Subscription not found" });
      return;
    }
    reply.status(200).send(subscription);
  } catch (error) {
    reply.status(500).send({ error: "Internal server error" });
  }
}

async function updateSubscriptionStatus(req: Request, reply: Reply) {
  const subscriptionId = (req.params as { id: string }).id;
  const { status } = req.body as { status: string };

  try {
    const updatedSubscription = await Subscription.findByIdAndUpdate(
      subscriptionId,
      { status },
      { new: true }
    );

    if (!updatedSubscription) {
      reply.status(404).send({ error: "Subscription not found" });
      return;
    }

    reply.status(200).send(updatedSubscription);
  } catch (error) {
    reply.status(500).send({ error: "Internal server error" });
  }
}

async function deleteSubscription(req: Request, reply: Reply) {
  const subscriptionId = (req.params as { id: string }).id;

  try {
    const updatedSubscription = await Subscription.findByIdAndUpdate(
      subscriptionId,
      { isDeleted: true },
      { new: true }
    );

    if (!updatedSubscription) {
      reply.status(404).send({ error: "Subscription not found" });
      return;
    }

    reply.status(200).send(updatedSubscription);
  } catch (error) {
    reply.status(500).send({ error: "Internal server error" });
  }
}

// Get all subscriptions for a user
async function getSubscriptionsByUserId(req: Request, reply: Reply) {
  const userId = (req.params as { userId: string }).userId;

  try {
    const subscriptions = await Subscription.find({ userId, isDeleted: false });
    if (!subscriptions.length) {
      reply.status(404).send({ error: "No subscriptions found for this user" });
      return;
    }

    reply.status(200).send(subscriptions);
  } catch (error) {
    console.error("Error fetching subscriptions for user:", error);
    reply.status(500).send({ error: "Internal server error" });
  }
}

export {
  createSubscription,
  getSubscriptionById,
  updateSubscriptionStatus,
  deleteSubscription,
  getSubscriptionsByUserId,
};
