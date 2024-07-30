import { FastifyRequest as Request, FastifyReply as Reply } from "fastify";
import { IUser } from "../database/interfaces/IUser";
import { User } from "../database/models/User";
import bcrypt from "bcrypt";
import { createUserController } from "./userController";
import { generateOtp } from "../utils/otp";
import { sendOtpEmail } from "../utils/email";
import jwt from "jsonwebtoken";

async function signUp(req: Request, reply: Reply) {
  const userObject = req.body as IUser;
  const { username, email, password, profilePicture, dateOfBirth } = userObject;

  try {
    let existingUser: IUser | null = await User.findOne({ email });
    if (existingUser) {
      reply.status(400).send({
        error:
          "You already have an account with this email address. Please log in",
      });
    }

    existingUser = await User.findOne({ username });
    if (existingUser) {
      reply.status(400).send({
        error: "The username already exists. Please choose another one.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOtp(); // Function to generate a random OTP
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes
    userObject.password = hashedPassword;
    userObject.otp = otp;
    userObject.otpExpires = otpExpires;

    const newUser: IUser = await createUserController(userObject);
    reply.status(200).send(newUser);
    await sendOtpEmail(email, otp);
    reply
      .status(200)
      .send({ message: "User registered. Please verify your email." });
  } catch (error) {
    reply.status(500).send({ error: "Internal server error" });
  }
}
async function login(req: Request, reply: Reply) {
  const { username, password } = req.body as any;

  try {
    // Find the user by username
    const user: IUser | null = await User.findOne({ username });

    // Check if the user exists and is not marked as deleted
    if (!user || user.isDeleted) {
      return reply.status(404).send({ error: "Username does not exist" });
    }

    // Check if the password matches
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return reply.status(401).send({ error: "Password is incorrect" });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id }, "beat+_project", {
      expiresIn: "1h",
    });

    // Send the token and user information as response
    reply.status(200).send({
      message: "Login successful",
      token,
      user: { username: user.username, email: user.email },
    });
  } catch (error) {
    reply.status(500).send({ error: "Internal server error" });
  }
}
export { signUp, login };
