import { getAsync, setAsync, delAsync } from "../configs/redisClient";
import { User } from "../database/models/User";
import { IUser } from "../database/interfaces/IUser";

async function createUser(
  username: string,
  email: string,
  password: string,
  profilePicture: string | null,
  dateOfBirth: Date | null,
  otp: string | null,
  otpExpire: string | null
): Promise<IUser> {
  const user = new User({
    username,
    email,
    password: password,
    profile_picture_url: profilePicture,
    date_of_birth: dateOfBirth,
    created: Date.now(),
    updated: Date.now(),
    otp,
    otpExpire,
  });
  await user.save();
  return user;
}
async function getUser(userId: string): Promise<IUser | null> {
  let user = await getAsync(`user:${userId}`);
  if (user) {
    return JSON.parse(user) as IUser;
  }
  user = await User.findById(userId).exec();
  if (user) {
    await setAsync(`user:${userId}`, JSON.stringify(user), "EX", 3600);
  }
  return user;
}
async function updateUser(
  userId: string,
  updates: Partial<IUser>
): Promise<IUser | null> {
  const user = await User.findByIdAndUpdate(userId, updates, {
    new: true,
  }).exec();
  if (user) {
    await setAsync(`user:${userId}`, JSON.stringify(user), "EX", 3600);
  }
  return user;
}
async function deleteUser(userId: string): Promise<void> {
  const user = await User.findByIdAndUpdate(userId, { isDeleted: true }).exec();
  await delAsync(`user:${userId}`);
}
async function getAllUsers(): Promise<IUser[]> {
  return User.find().exec();
}
export { createUser, getUser, updateUser, deleteUser, getAllUsers };
