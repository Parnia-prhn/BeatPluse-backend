import { FastifyRequest as Request, FastifyReply as Reply } from "fastify";
import { IUser } from "../database/interfaces/IUser";
import { User } from "../database/models/User";
import {
  createUser,
  updateUser,
  getUser,
  deleteUser,
  getAllUsers,
} from "../services/userService";
async function createUserController(obj: IUser): Promise<IUser> {
  const username = obj.username;
  const email = obj.email;
  const password = obj.password;
  const profilePicture = obj.profilePicture;
  const dateOfBirth = obj.dateOfBirth;
  const otp = obj.otp;
  const otpExpires = obj.otpExpires;

  try {
    const newUser: IUser = await createUser(
      username,
      email,
      password,
      profilePicture,
      dateOfBirth,
      otp,
      otpExpires
    );
    return newUser;
  } catch (err) {
    throw new Error("Internal server error");
  }
}
async function updateUserController(req: Request, reply: Reply): Promise<void> {
  // interface paramsType {
  //   userId?: String;
  // }
  // const params = req.params as paramsType;
  // const userId = params.userId;
  const userId = (req.params as { id: string }).id;
  const updates = req.body as Partial<IUser>;
  try {
    const user: IUser | null = await User.findById(userId);
    if (!user || user.isDeleted) {
      reply.status(404).send({ error: "User not found" });
      return;
    }
    const updatedUser: IUser | null = await updateUser(userId, updates);
    reply.status(200).send(updatedUser);
  } catch (err) {
    reply.status(500).send({ error: "Internal server error" });
  }
}
async function deleteUserController(req: Request, reply: Reply): Promise<void> {
  // interface paramsType {
  //   userId?: string;
  // }
  // const params = req.body as paramsType;
  // const userId = params.userId;
  const userId = (req.params as { id: string }).id;
  try {
    const user: IUser | null = await User.findById(userId);
    if (!user || user.isDeleted) {
      reply.status(404).send({ error: "user not found!" });
    }
    await deleteUser(userId);
    reply.status(500).send({ message: "user deleted successfully!" });
  } catch (err) {
    reply.status(500).send({ error: "Internal server error" });
  }
}
async function getUserController(req: Request, reply: Reply) {
  const userId = (req.params as { id: string }).id;
  try {
    const user: IUser | null = await User.findById(userId);
    if (!user || user.isDeleted) {
      reply.status(404).send({ error: "user not found!" });
    }
    const userInfo = await getUser(userId);
    reply.send(user);
  } catch (error) {
    reply.status(500).send({ error: "Internal server error" });
  }
}
async function getAllUsersController(req: Request, reply: Reply) {
  try {
    const users = await getAllUsers();
    reply.send(users);
  } catch (error) {
    reply.status(500).send({ error: "Internal server error" });
  }
}
async function getUsersSearchByName(req: Request, reply: Reply) {
  const name = (req.params as { name: string }).name;
  try {
    const users: IUser[] | null = await User.find({
      username: { $regex: name, $options: "i" }, //  a regular expression for partial match, case insensitive
      isDeleted: false,
    }).exec();

    if (!users || users.length === 0) {
      reply.status(404).send({ error: "not found any users with this name" });
      return;
    }
    reply.status(200).send(users);
  } catch (error) {
    reply.status(500).send({ error: "internal server error" });
  }
}
async function verifyOtp(req: Request, reply: Reply) {
  const { email, otp } = req.body as { email: string; otp: string };

  try {
    const user = await User.findOne({ email });
    if (!user || user.isDeleted) {
      reply.status(404).send({ error: "User not found" });
      return;
    }

    if (user.otp !== otp || user.otpExpires < new Date()) {
      reply.status(400).send({ error: "Invalid or expired OTP" });
      return;
    }

    user.otp = ""; // Clear OTP
    user.otpExpires = new Date(0); // Reset OTP expiration
    await user.save();

    reply.status(200).send({ message: "Email verified successfully" });
  } catch (error) {
    reply.status(500).send({ error: "Internal server error" });
  }
}
export {
  createUserController,
  updateUserController,
  deleteUserController,
  getUserController,
  getAllUsersController,
  getUsersSearchByName,
  verifyOtp,
};
