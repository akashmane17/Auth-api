import { get } from "lodash";
import { Request, Response, NextFunction } from "express";
import { reIssueAccessToken } from "../service/session.service";
import { verifyJwt } from "../utils/jwt";

const deserializeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // get access and refresh token
  const accessToken =
    get(req, "cookies.accessToken") ||
    get(req, "headers.authorization", "").replace(/^Bearer\s/, "");

  const refreshToken =
    get(req, "cookies.refreshToken") || get(req, "headers.x-refresh");

  if (!accessToken) {
    return next();
  }

  // decode access token
  const { decoded, expired } = verifyJwt(accessToken);

  if (decoded) {
    res.locals.user = decoded;
    return next();
  }

  // if access token is expired and refresh token is present
  if (expired && refreshToken) {
    // create new access token
    const newAccessToken = await reIssueAccessToken({ refreshToken });

    // set accesstoken to cookies
    if (newAccessToken) {
      res.setHeader("x-access-token", newAccessToken);

      res.cookie("accessToken", newAccessToken, {
        maxAge: 900000, // 15 mins
        httpOnly: true,
        domain: "localhost",
        path: "/",
        sameSite: "strict",
        secure: false,
      });
    }

    // set user to locals
    const result = verifyJwt(newAccessToken as string);
    res.locals.user = result.decoded;

    return next();
  }

  return next();
};

export default deserializeUser;
