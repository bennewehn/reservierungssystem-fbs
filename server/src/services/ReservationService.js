import {
  createReservationDB,
  getReservationsForPeriodDB,
  getReservationsCountForPeriodDB,
  getReservationsForDayDB,
  getReservationsByUserIdDB,
  deleteReservationsByUserByIdDB,
} from "../db/ReservationsDB.js";
import { NotEnoughReservationsAvailableError } from "../errors.js";
import ConfigurationService from "./ConfigurationService.js";

export default class ReservationService {
  static async createReservation(data, user) {
    // check if enough reservations are available
    const maxReservations = await this.getMaxReservations();

    if (data.count > maxReservations) {
      throw new NotEnoughReservationsAvailableError(
        "Not enough reservations available."
      );
    }

    // add one second to fix overlapping
    const mStart = new Date(data.startTime);
    const mEnd = new Date(data.endTime);
    mStart.setSeconds(mStart.getSeconds() + 1);
    mEnd.setSeconds(mEnd.getSeconds() - 1);

    // get all reservations in time period
    const reservationsCount = await getReservationsCountForPeriodDB(
      mStart,
      mEnd
    );

    if (reservationsCount + parseInt(data.count) > maxReservations) {
      throw new NotEnoughReservationsAvailableError(
        "Not enough reservations available."
      );
    }
    // insert
    return await createReservationDB(
      user.userId,
      data.startTime,
      data.endTime,
      data.count
    );
  }

  static async getMaxReservations() {
    return await ConfigurationService.getValueByKey("maxReservations");
  }

  static async getUserReservations(user) {
    return await getReservationsByUserIdDB(user.userId);
  }

  static async deleteUserReservationById(user, id) {
    const res = await deleteReservationsByUserByIdDB(user.userId, id);
    return res.affectedRows > 0;
  }

  static async getReservationsTimePeriod(startTime, endTime) {
    // add one second to fix overlapping
    startTime.setSeconds(startTime.getSeconds() + 1);
    endTime.setSeconds(endTime.getSeconds() - 1);
    const reservations = await getReservationsForPeriodDB(startTime, endTime);
    return reservations;
  }

  static async getReservationsForDay(day) {
    const reservations = await getReservationsForDayDB(day);
    return reservations;
  }
}
