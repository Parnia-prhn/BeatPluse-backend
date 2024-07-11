import { FastifyRequest as Request, FastifyReply as Reply } from "fastify";
import { IUser } from "../database/interfaces/IUser";
import { User } from "../database/models/User";

async function createUser(obj: IUser): Promise<IUser> {
  const username = obj.username;
  const email = obj.email;
  const password = obj.password;
  const profilePicture = obj.profilePicture;
  const dateOfBirth = obj.dateOfBirth;

  try {
    const existingUser: IUser | null = await User.findOne({ email });
    if (existingUser) {
      throw new Error("email already exists");
    }

    const newUser: IUser = new User({
      username,
      email,
      password,
      profilePicture,
      dateOfBirth,
      created: Date.now(),
      updated: Date.now(),
    });

    const savedUser: IUser = await newUser.save();

    return savedUser;
  } catch (err) {
    throw new Error("Internal server error");
  }
}
async function updateUser(req: Request, reply: Reply): Promise<void> {
  interface paramsType {
    userId?: string;
  }
  const params = req.params as paramsType;
  const userId = params.userId;
  const { password, profilePicture, dateOfBirth } = req.body as any;
  try {
    const user: IUser | null = await User.findById(userId);
    if (!user) {
      reply.status(404).send({ error: "User not found" });
      return;
    }
    const updatedUser: IUser | null = await User.findByIdAndUpdate(
      userId,
      {
        username: user.username,
        email: user.email,
        password,
        profilePicture,
        dateOfBirth,
        created: user.created,
        updated: Date.now(),
      },
      { new: true }
    );
    reply.status(200).send(updatedUser);
  } catch (err) {
    reply.status(500).send({ error: "Internal server error" });
  }
}
async function deleteUser(req: Request, reply: Reply): Promise<void> {
  interface paramsType {
    userId?: string;
  }
  const params = req.body as paramsType;
  const userId = params.userId;
  try {
    const user: IUser | null = await User.findById(userId);
    if (!user) {
      reply.status(404).send({ error: "user not found!" });
    }
    const deletedUser: IUser | null = await User.findByIdAndUpdate(userId, {
      isDeleted: true,
    });
    reply.status(500).send({ message: "user deleted successfully!" });
  } catch (err) {
    reply.status(500).send({ error: "Internal server error" });
  }
}
