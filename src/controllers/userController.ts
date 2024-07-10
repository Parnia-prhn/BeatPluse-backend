import { FastifyRequest as Request, FastifyReply as Reply } from "fastify";
import { IUser } from "../database/interfaces/IUser";
import { User } from "../database/models/User";

async function createUser(obj: IUser): Promise<IUser> {
  const username = obj.username;
  const email = obj.email;
  const password = obj.password;
  const profilePicture = obj.profilePicture;
  const dateOfBirth = obj.dateOfBirth;
  const created = obj.created;
  const updated = obj.updated;
  const isDeleted = obj.isDeleted;
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
      created,
      updated,
      isDeleted,
    });

    const savedUser: IUser = await newUser.save();

    return savedUser;
  } catch (err) {
    throw new Error("Internal server error");
  }
}
