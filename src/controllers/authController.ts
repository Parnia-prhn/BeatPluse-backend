import { FastifyRequest as Request, FastifyReply as Reply } from "fastify";
import { IUser } from "../database/interfaces/IUser";
import { User } from "../database/models/User";
import bcrypt from "bcrypt";
import { createUserController } from "./userController";
import { generateOtp } from "../utils/otp";
import { sendOtpEmail } from "../utils/email";

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
    userObject.otpExpire = otpExpires;

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
