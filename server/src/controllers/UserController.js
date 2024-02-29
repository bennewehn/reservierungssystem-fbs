import UserService from "../services/UserService.js";

export default class UserController {
  static async postUser(req, res) {
    try {
      await UserService.createUser(req.body.data);
      res.sendStatus(201);
    } catch (error) {
      res.status(409).send({ message: "User already exists." });
    }
  }

  static async login(req, res) {
    try {
      const { accessToken, refreshToken } = await UserService.login(
        req.body.data
      );
      res
        .cookie("refreshToken", refreshToken, {
          httpOnly: true,
          sameSite: "strict",
          maxAge: process.env.REFRESH_TOKEN_EXPIRATION,
        })
        .header("Authorization", accessToken)
        .sendStatus(200);
    } catch (error) {
      res.status(401).json({ message: error.message });
    }
  }

  static async refresh(req, res) {
    const refreshToken = req.cookies["refreshToken"];

    if (!refreshToken) {
      return res
        .status(401)
        .send({ message: "Access Denied. No refresh token provided." });
    }

    try {
      const accessToken = await UserService.generateAccessRefreshToken(refreshToken);
      res.header("Authorization", accessToken).sendStatus(200);
    } catch (error) {
      return res.status(500).send({ message: error });
    }
  }
}