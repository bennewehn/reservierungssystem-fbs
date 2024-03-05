import { NotEnoughReservationsAvailableError } from "../errors.js";
import ReservationService from "../services/ReservationService.js";

export default class ReservationsController {
  static async getTimePeriod(req, res) {
    try {
      const reservations = await ReservationService.getReservationsTimePeriod(
        req.query.startTime,
        req.query.endTime
      );
      res.send(reservations);
    } catch (e) {
      console.error(e);
      res.sendStatus(500);
    }
  }

  static async getDay(req, res) {
    try {
      const reservations = await ReservationService.getReservationsForDay(
        req.query.day
      );
      res.send(reservations);
    } catch (e) {
      console.error(e);
      res.sendStatus(500);
    }
  }

  static async postReservation(req, res) {
    try {
      const id = await ReservationService.createReservation(
        req.body.data,
        req.user
      );
      res.status(201).send({ id: id });
    } catch (error) {
      if (error instanceof NotEnoughReservationsAvailableError) {
        res.status(409).json({ error: error.message });
      } else {
        res.sendStatus(500);
        console.log(error);
      }
    }
  }

  static async getMaxReservations(req, res) {
    try {
      const maxRes = await ReservationService.getMaxReservations();
      res.status(200).json({ maxReservations: maxRes });
    } catch (e) {
      res.sendStatus(500);
    }
  }

  static async getUserReservations(req, res) {
    try {
      const reservations = await ReservationService.getUserReservations(
        req.user
      );
      res.status(200).json(reservations);
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  }

  static async deleteReservationById(req, res) {
    try {
      const found = await ReservationService.deleteUserReservationById(req.user, req.params.id);
      if(!found){
        res.status(404).json({error: "Reservation not found."});
      }
      else{
        res.sendStatus(200);
      }
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  }
}