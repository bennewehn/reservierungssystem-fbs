import UserService from "../services/UserService.js";
import {
  UserNotFoundError,
  PasswordInvalidError,
  UserAlreadyExistsError,
  RefreshTokenNotValidError,
  RefreshTokenExpiredError,
} from "../errors.js";

export default class UserController {
  static async postUser(req, res) {
    try {
      await UserService.createUser(req.body.data);
      res.sendStatus(201);
    } catch (error) {
      if (error instanceof UserAlreadyExistsError) {
        res.status(409).json({ message: "User already exists." });
      } else {
        res.sendStatus(500);
        console.log(error);
      }
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
          sameSite: "none",
          secure: true,
          maxAge: parseInt(process.env.REFRESH_TOKEN_EXPIRATION) * 1000 * 365,
        })
        .header("Authorization", accessToken)
        .sendStatus(200);
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        res
          .status(404)
          .json({ errors: [{ msg: error.message, path: "data.email" }] });
      } else if (error instanceof PasswordInvalidError) {
        res
          .status(401)
          .json({ errors: [{ msg: error.message, path: "data.password" }] });
      } else {
        console.log(error)
        res.sendStatus(500);
      }
    }
  }

  static ensureRefreshToken(req, res) {
    const refreshToken = req.cookies["refreshToken"];
    if (!refreshToken) {
      res
        .status(401)
        .send({ message: "Access Denied. No refresh token provided." });
    }
    return refreshToken;
  }

  static async logout(req, res) {
    const refreshToken = UserController.ensureRefreshToken(req, res);
    if (refreshToken) {
      try {
        await UserService.logout(refreshToken);
        res.clearCookie('refreshToken', {httpOnly: true});
        res.sendStatus(200);
      } catch (error) {
        return res.sendStatus(500);
      }
    }
  }

  static async refresh(req, res) {
    const refreshToken = UserController.ensureRefreshToken(req, res);
    if (refreshToken) {
      try {
        const accessToken = await UserService.generateAccessRefreshToken(
          refreshToken
        );
        res.header("Authorization", accessToken).sendStatus(200);
      } catch (error) {
        if(error instanceof RefreshTokenNotValidError || error instanceof RefreshTokenExpiredError){
          return res.status(403).send({ message: error.message });
        }
        return res.status(500).send({ message: error });
      }
    }
  }
}
