import { Request, Response } from "express";
import { CreateSessionInput } from "../schema/auth.schema";
import { findUserByEmail } from "../service/user.service";
import config from "config";
import {
  createSession,
  findSessions,
  updateSession,
} from "../service/session.service";
import { signJwt } from "../utils/jwt";

export async function createSessionHandler(
  req: Request<{}, {}, CreateSessionInput>,
  res: Response
) {
  const message = "Invalid email or password";
  const { email, password } = req.body;

  const user = await findUserByEmail(email);

  if (!user) {
    return res.send(message);
  }

  if (!user.verified) {
    return res.send("Please verify your email");
  }

  const isValid = await user.validatePassword(password);

  if (!isValid) {
    return res.send(message);
  }

  // create a session
  const session = await createSession({ userId: String(user._id) });

  const userInfo = {
    _id: user._id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    verified: true,
  };

  // create an access token
  const accessToken = signJwt(
    { user: userInfo, session: session._id },
    { expiresIn: config.get("accessTokenTtl") } // 15 minutes
  );

  // create a refresh token
  const refreshToken = signJwt(
    { user: userInfo, session: session._id },
    { expiresIn: config.get("refreshTokenTtl") } // 15 minutes
  );

  // set cookies
  res.cookie("accessToken", accessToken, {
    maxAge: 900000, // 15 mins
    httpOnly: true,
    domain: "localhost",
    path: "/",
    sameSite: "strict",
    secure: false,
  });

  res.cookie("refreshToken", refreshToken, {
    maxAge: 3.154e10, // 1 year
    httpOnly: true,
    domain: "localhost",
    path: "/",
    sameSite: "strict",
    secure: false,
  });

  // send the token
  return res.send({
    userId: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    isVerified: user.verified,
  });
}

/**
 * @desc Get session
 * @route GET /api/sessions/:id
 * @access Private
 */
export async function getUserSessionsHandler(req: Request, res: Response) {
  const userId = res.locals.user.user._id;

  const sessions = await findSessions({ user: userId, valid: true });

  return res.send(sessions);
}

/**
 * @desc Delete session
 * @route DELETE /api/sessions/:id
 * @access Private
 */
export async function deleteSessionHandler(req: Request, res: Response) {
  const sessionId = res.locals.user.session;

  await updateSession({ _id: sessionId }, { valid: false });

  res.cookie("accessToken", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.cookie("refreshToken", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  return res.send({
    accessToken: null,
    refreshToken: null,
  });
}
