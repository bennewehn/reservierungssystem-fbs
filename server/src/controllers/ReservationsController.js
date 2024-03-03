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
    } catch (e) {
      res.status(409).send({ message: e.message });
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

  static async deleteReservationById(req, res) {}

  static async putReservation(req, res) {}
}
