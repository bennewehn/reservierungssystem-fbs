import {
  createReservationDB,
  getReservationsForPeriodDB,
  getReservationsCountForPeriodDB,
  getReservationsForDayDB,
} from "../db/ReservationsDB.js";
import ConfigurationService from "./ConfigurationService.js";

export default class ReservationService {
  static async createReservation(data, user) {
    // get all reservations in time period
    const { reservationsCount } = await getReservationsCountForPeriodDB(
      data.startTime,
      data.endTime
    );
    // check if enough reservations are available
    const maxReservations = this.getMaxReservations(); 

    if (reservationsCount + data.count >= maxReservations) {
      throw new Error("Not enough reservations available.");
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

  static async getReservationsTimePeriod(startTime, endTime) {
    const reservations = await getReservationsForPeriodDB(startTime, endTime);
    return reservations;
  }

  static async getReservationsForDay(day) {
    const reservations = await getReservationsForDayDB(day);
    return reservations;
  }
}
