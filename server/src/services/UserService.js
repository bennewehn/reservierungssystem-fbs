import { createUserDB, getUserByEmailDB, getUserByIdDB } from "../db/UsersDB.js";
import {
  createRefreshTokenDB,
  getRefreshTokenDB,
  deleteRefreshTokenByIdDB,
  getRefreshTokenByUserIdDB
} from "../db/RefreshTokenDB.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {v4} from "uuid";

export default class UserService {
  static async createUser(data) {
    const user = await getUserByEmailDB(data.email);
    if (user) {
      throw new Error("Email already used.");
    }
    const hashedPassword = await bcrypt.hash(data.password, 10);
    await createUserDB(data.name, data.email, hashedPassword);
  }

  static async login(data) {

    const user = await getUserByEmailDB(data.email);

    if (!user) {
      throw new Error("User not found.");
    }

    // check if refresh token exists for user
    // delete it if there is already a refresh token for user
    const token = await getRefreshTokenByUserIdDB(user.userId);
    if(token){
      await deleteRefreshTokenByIdDB(token.refreshTokenId);
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
      throw new Error("Invalid password.");
    }

    const accessToken = await this.generateAccessToken(user);
    const refreshToken = await this.createRefreshToken(user);

    return { accessToken, refreshToken };
  }

  static async createRefreshToken(user) {
    let expiredAt = new Date();

    expiredAt.setSeconds(
      expiredAt.getSeconds() + parseInt(process.env.REFRESH_TOKEN_EXPIRATION)
    );

    let token = v4();

    await createRefreshTokenDB(user.userId, token, expiredAt);

    return token;
  }

  static async generateAccessToken(user) {
    const payload = { userId: user.userId, email: user.email, name: user.name };
    return jwt.sign(payload, process.env.TOKEN_SECRET, {
      expiresIn: parseInt(process.env.ACCESS_TOKEN_EXPIRATION),
    });
  }

  static async generateAccessRefreshToken(refreshToken) {
    let refreshTokenDB = await getRefreshTokenDB(refreshToken);

    if (!refreshTokenDB) {
      throw Error("Refresh token not valid.");
    }

    if (this.verifyRefreshTokenExpiration(refreshTokenDB)) {
      await deleteRefreshTokenByIdDB(refreshTokenDB.refreshTokenId);
      throw Error(
        "Refresh token was expired. Please make a new signin request."
      );
    }

    const user = await getUserByIdDB(refreshTokenDB.userId);
    let newAccessToken = this.generateAccessToken(user);

    return newAccessToken;
  }

  static verifyRefreshTokenExpiration(token) {
    return token.expiryDate.getTime() < new Date().getTime();
  }
}
