# Reservierungssystem
Ein Reservierungssystem, dass eine Anzahl von gleichzeitig verfügbaren Plätze verwaltet.


## Funktionen
- Loginsystem, Benutzer anlegen
- Admin: Anzahl der gleichzeitig verfügbaren Plätze festlegen
- Tag und Zeit auswählen und bestimmte Anzahl von Plätzen reservieren
- UI mit Kalenderdarstellung

## Technologie 
- Webapp in React
- Datenbanksystem mit Java REST-API
- MySQL Datenbank

## API
- Reservierungen für Zeitraum
- Reservierungen für einen Tag
- Reservierung erstellen
- Reservierung löschen
- Reservierung bearbeiten

### API Endpunkte
#### Reservation
Get Reservations for Time Period:
GET /reservations/time-period?start=START_DATE&end=END_DATE
Get Reservations for a Day:
GET /reservations/day?date=DATE
Create Reservation:
POST /reservations
Delete Reservation:
DELETE /reservations/:id
Update Reservation:
PUT /reservations/:id

#### User 
POST /login
GET /users/:mail: Create a new user.
POST /users: Create a new user.
PUT /users/:mail: Update an existing user.
DELETE /users/:mail: Delete a user by ID.

Routes: No logic, chain together controller functions and routes
Controller: No business logic, just handle the request
Services: Majority of business logic, algorithmic code

https://www.coreycleary.me/project-structure-for-an-express-rest-api-when-there-is-no-standard-way/

# validation
