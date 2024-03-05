import express from "express";
import ReservationsController from "../controllers/ReservationsController.js";
import {
  validate,
  reservationTimePeriodRules,
  createReservationRules,
  reservationsForDayRules,
  reservationIdSchema,
} from "../middleware/validation.js";

const ReservationRouter = express.Router();

ReservationRouter.get(
  "/time-period",
  reservationTimePeriodRules(),
  validate,
  ReservationsController.getTimePeriod
);

ReservationRouter.get(
  "/day",
  reservationsForDayRules(),
  validate,
  ReservationsController.getDay
);

ReservationRouter.get(
  "/max",
  ReservationsController.getMaxReservations
);

ReservationRouter.post(
  "/",
  createReservationRules(),
  validate,
  ReservationsController.postReservation
);

ReservationRouter.get(
  "/",
  ReservationsController.getUserReservations
);

ReservationRouter.delete(
  "/:id",
  reservationIdSchema,
  validate,
  ReservationsController.deleteReservationById
);


export default ReservationRouter;