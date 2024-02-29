import pool from "./index.js";

export async function createReservationDB(user, startTime, endTime, amountPCs) {
  const [result] = await pool.query(
    `INSERT INTO reservation (user, startTime, endTime, count) VALUES
    (?,?,?,?)`,
    [user, startTime, endTime, amountPCs]
  );
  return result.insertId;
}

const resPeriodCondition =
  "WHERE (startTime BETWEEN ? AND ?) OR (endTime BETWEEN ? AND ?);";

export async function getReservationsForPeriodDB(startTime, endTime) {
  const [result] = await pool.query(
    `SELECT * FROM reservation ` + resPeriodCondition,
    [startTime, endTime, startTime, endTime]
  );
  return result;
}

export async function getReservationsCountForPeriodDB(startTime, endTime) {
  const [result] = await pool.query(
    `SELECT COUNT(*) AS reservationsCount FROM reservation ` +
      resPeriodCondition,
    [startTime, endTime, startTime, endTime]
  );
  return result[0];
}

export async function getReservationsForDayDB(day) {
  const [result] = await pool.query(
    `SELECT * FROM reservation WHERE ? BETWEEN Date(startTime) AND Date(endTime)`,
    [day]
  );
  return result;
}
