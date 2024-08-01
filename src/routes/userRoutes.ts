import { FastifyInstance } from "fastify";
import {
  createUserController,
  updateUserController,
  deleteUserController,
  getUserController,
  getAllUsersController,
  getUsersSearchByName,
  verifyOtp,
} from "../controllers/userController";

async function userRoutes(fastify: FastifyInstance) {
  //   fastify.post("/users/create", createUserController);
  fastify.put("/users/update/:id", updateUserController);
  fastify.delete("/users/delete/:id", deleteUserController);
  fastify.get("/users/:id", getUserController);
  fastify.get("/users", getAllUsersController);
  fastify.get("/users/search/:name", getUsersSearchByName);
  fastify.post("/users/verify-otp", verifyOtp);
}

export default userRoutes;
