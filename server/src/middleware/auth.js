import jwt from "jsonwebtoken";

const catchError = (err, res) => {
  if (err instanceof jwt.TokenExpiredError) {
    return res
      .status(401)
      .send({ message: "Unauthorized! Access Token was expired!" });
  }

  return res.status(401).send({ message: "Unauthorized!" });
};

const sendTokenMissingError = (res) => {
  return res.status(403).send({ message: "No token provided!" });
};

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    sendTokenMissingError(res);
    return;
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    sendTokenMissingError(res);
    return;
  }

  jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return catchError(err, res);
    }
    req.user = decoded;
    next();
  });
};

export default authMiddleware;
