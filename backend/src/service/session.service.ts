import { DocumentType } from "@typegoose/typegoose";
import { omit, get } from "lodash";
import { User, privateFields } from "../model/user.model";
import { signJwt, verifyJwt } from "../utils/jwt";
import SessionModel, { Session } from "../model/session.model";
import config from "config";
import { FilterQuery, UpdateQuery } from "mongoose";
import { findUser, findUserById } from "./user.service";

export async function createSession({ userId }: { userId: string }) {
  return SessionModel.create({ user: userId });
}

export async function updateSession(
  query: FilterQuery<Session>,
  update: UpdateQuery<Session>
) {
  return SessionModel.updateOne(query, update);
}

export async function findSessionById(id: string) {
  return SessionModel.findById(id);
}

export async function findSessions(query: FilterQuery<Session>) {
  return SessionModel.find(query).lean();
}

export async function reIssueAccessToken({
  refreshToken,
}: {
  refreshToken: string;
}) {
  // decode refresh token
  const { decoded } = verifyJwt(refreshToken);

  if (!decoded || !get(decoded, "session")) return false;

  // check if the session is valid or not
  const session = await SessionModel.findById(get(decoded, "session"));
  if (!session || !session.valid) return false;

  const userid = session.user?.toString();
  // get user
  const user = await findUserById(userid as string);
  if (!user) return false;

  // create new access token
  const accessToken = signJwt(
    { user: user, session: session._id },
    { expiresIn: config.get("accessTokenTtl") } // 15 minutes
  );

  // return access token
  return accessToken;
}
