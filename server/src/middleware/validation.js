import { body, checkSchema, query, validationResult } from "express-validator";

export const loginValidationRules = () => {
  return [
    body("data.email").isEmail().withMessage("Ungültige Email."),
    body("data.password")
      .notEmpty()
      .withMessage("Passwort wird benötigt.")
      .isString()
      .withMessage("Passwort muss eine Zeichenkette sein."),
  ];
};

export const createUserValidationRules = () => {
  return [
    body("data.firstName").isLength({ min: 1 }).withMessage("Vorname wird benötigt."),
    body("data.lastName").isLength({ min: 1 }).withMessage("Nachname wird benötigt."),
    body("data.email").isEmail().withMessage("Ungültige Email."),
    body("data.password")
      .isString()
      .withMessage("Passwort muss eine Zeichenkette sein.")
      .isLength({ min: 6 })
      .withMessage("Passwort muss mindestens 6 Zeichen lang sein."),
  ];
};

function validateStartAndEndTime(validChainStartTime, validChainEndTime) {
  return [
    validChainStartTime
      .exists()
      .isISO8601()
      .toDate()
      .withMessage("startTime must be a valid date."),
    validChainEndTime
      .exists()
      .isISO8601()
      .toDate()
      .withMessage("endTime must be a valid date.")
      .custom((value, { req }) => {
        // Custom validation to ensure endTime is after startTime
        const startTime = new Date(req.query.startTime);
        const endTime = new Date(value);
        if (endTime <= startTime) {
          throw new Error("endTime must be after startTime.");
        }
        return true;
      }),
  ];
}

export const reservationTimePeriodRules = () => {
  return validateStartAndEndTime(query("startTime"), query("endTime"));
};

export const createReservationRules = () => {
  return [
    ...validateStartAndEndTime(body("data.startTime"), body("data.endTime")),
    body("data.count")
      .exists()
      .withMessage("count is required")
      .isNumeric()
      .withMessage("Invalid count format")
      .isInt({ min: 1 })
      .withMessage("Amount must be a positive integer greater than zero"),
  ];
};

// Custom validation function for date type (ISO 8601 format)
const isValidDate = (value) => {
  // Regular expression to match date in the format YYYY-MM-DD
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

  // Check if the value matches the date format
  if (!dateRegex.test(value)) {
    throw new Error('Invalid date format (YYYY-MM-DD)');
  }

  // Parse the date components
  const [year, month, day] = value.split('-').map(Number);

  // Validate the date components
  if (isNaN(year) || isNaN(month) || isNaN(day) ||
      month < 1 || month > 12 || 
      day < 1 || day > 31) {
    throw new Error('Invalid date');
  }

  return true;
};

export const reservationsForDayRules = () => {
  return [
    query("day")
    .exists()
    .withMessage("day is required")
    .custom(isValidDate)
    .withMessage("day must be a valid date"),
  ];
};

export const reservationIdSchema = checkSchema({
  id: {
    in: ['params'],
    isInt: {
      errorMessage: 'ID must be an integer',
      bail: true // Stop validation if this fails
    },
    notEmpty: {
      errorMessage: 'ID cannot be empty',
      bail: true // Stop validation if this fails
    }
  }
});

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  return res.status(400).json({ errors: errors.array() });
};