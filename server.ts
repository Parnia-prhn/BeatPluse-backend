import dotenv from "dotenv";
import {
  fastify,
  FastifyInstance,
  FastifyRequest,
  FastifyReply,
} from "fastify";
import connectToDatabase from "./src/configs/db";
import albumRoutes from "./src/routes/albumRoutes";
import artistRoutes from "./src/routes/artistRoutes";
import authRoutes from "./src/routes/authRoutes";
import followRoutes from "./src/routes/followRoutes";
import genreRoutes from "./src/routes/genreRoutes";
import likeRoutes from "./src/routes/likeRoutes";
import paymentRoutes from "./src/routes/paymentRoutes";
import playlistRoutes from "./src/routes/playlistRoutes";
import podcastRoutes from "./src/routes/podcastRoutes";
import radioRoutes from "./src/routes/radioRoutes";
import songRoutes from "./src/routes/songRoutes";
import subscriptionRoutes from "./src/routes/subscriptionRoutes";
import userRoutes from "./src/routes/userRoutes";
// var cors = require("cors");

import cors from "@fastify/cors";
// const cors = require("fastify-cors");
// import cors from "fastify-cors";

const app: FastifyInstance = fastify();
// app.use(cors());
app.register(cors);
function requestLogger(
  req: FastifyRequest,
  reply: FastifyReply,
  next: () => void
) {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
}

async function startApp() {
  try {
    const dbConnection = await connectToDatabase();
    app.register(authRoutes);
    app.register(albumRoutes);
    app.register(artistRoutes);
    app.register(followRoutes);
    app.register(genreRoutes);
    app.register(likeRoutes);
    app.register(paymentRoutes);
    app.register(playlistRoutes);
    app.register(podcastRoutes);
    app.register(radioRoutes);
    app.register(songRoutes);
    app.register(subscriptionRoutes);
    app.register(userRoutes);

    app.addHook("preHandler", requestLogger);
    app.listen({ port: 3001 }, (err) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      console.log("Server is running on port 3001");
    });
  } catch (error) {
    console.error("Error starting the application:", error);
    process.exit(1);
  }
}

startApp();
dotenv.config();
