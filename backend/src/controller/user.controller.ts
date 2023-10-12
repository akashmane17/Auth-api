import { Request, Response } from "express";
import {
  CreateUserInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  VerifyUserInput,
} from "../schema/user.schema";
import {
  createUser,
  findUserById,
  findUserByEmail,
} from "../service/user.service";

import sendEmail from "../utils/mailer";
import log from "../utils/logger";
import { customAlphabet } from "nanoid";

export async function createUserHandler(
  req: Request<{}, {}, CreateUserInput>,
  res: Response
) {
  const body = req.body;

  try {
    const user = await createUser(body);

    await sendEmail({
      from: "test@example.com",
      to: user.email,
      subject: "Please verify your account",
      text: `verification code: ${user.verificationCode}. Id: ${user._id} `,
    });

    return res.send({
      userId: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      isVerified: user.verified,
    });
  } catch (e: any) {
    if (e.code === 11000) {
      return res.status(409).send("Accound already exists");
    }
    return res.status(500).send(e);
  }
}

export async function verifyUserHandler(
  req: Request<VerifyUserInput>,
  res: Response
) {
  const id = req.params.id;
  const verificationCode = req.body.verificationCode;

  // find the user by id
  const user = await findUserById(id);

  if (!user) {
    return res.send("Could not verify");
  }

  // check to see if they are already verified
  if (user.verified) {
    return res.send("User is already verified");
  }

  //  check to seee if the verificationCode matches
  if (user.verificationCode === verificationCode) {
    user.verified = true;

    await user.save();

    return res.send(" User succesfully verified");
  }

  return res.send("Could not verify user");
}

export async function forgotPasswordHandler(
  req: Request<{}, {}, ForgotPasswordInput>,
  res: Response
) {
  const message =
    " If a user with that email is registered you will receive a password reset email";

  const { email } = req.body;

  const user = await findUserByEmail(email);

  if (!user) {
    log.debug(`User with email ${email} does not exists`);
    res.send(message);
  }

  if (!user?.verified) {
    return res.send("User is not verified");
  }

  const nanoid = customAlphabet("0123456789", 6);
  const passwordResetCode = nanoid();

  user.passwordResetCode = passwordResetCode;

  await user.save();

  await sendEmail({
    to: user.email,
    from: "test@example.com",
    subject: "Reset your password",
    text: `Password reset code: ${passwordResetCode}. Id ${user._id}`,
  });

  log.debug(`Password reset email sent to ${email}`);

  return res.send(message);
}

export async function resetPasswordHandler(
  req: Request<ResetPasswordInput["params"], {}, ResetPasswordInput["body"]>,
  res: Response
) {
  const { id } = req.params;
  const { password, passwordResetCode } = req.body;

  const user = await findUserById(id);

  if (
    !user ||
    !user.passwordResetCode ||
    user.passwordResetCode !== passwordResetCode
  ) {
    return res.status(400).send("Could not reset user password");
  }

  user.passwordResetCode = null;

  user.password = password;

  await user.save();

  return res.send("Successfully updated password");
}

export async function getCurrentUserHandler(
  req: Request<ResetPasswordInput["params"], {}, ResetPasswordInput["body"]>,
  res: Response
) {
  return res.send(res.locals.user);
}
