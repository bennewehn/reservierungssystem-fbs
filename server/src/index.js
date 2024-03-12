import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import ReservationRouter from "./routes/ReservationsRouter.js";
import UserRouter from "./routes/UserRouter.js";
import dotenv from "dotenv";
import authMiddleware from "./middleware/auth.js";

dotenv.config();
const app = express();

const PORT = 3001;

app.use(express.json());
app.use(cookieParser());

app.enable('trust proxy');

app.use(cors({
  origin: process.env.WEB_URL,
  credentials: true,
  allowedHeaders: "Content-Type, Authorization",
  exposedHeaders: "Authorization"
}))

app.use("/reservations", authMiddleware, ReservationRouter);
app.use("/users", UserRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(PORT, (error) => {
  if (!error) {
    console.log(
      "Server is successfully running, and App is listening on port " + PORT
    );
  } else {
    console.log("Error occurred, server can't start", error);
  }
});
