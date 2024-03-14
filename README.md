# Reservierungssystem
Ein Reservierungssystem zum Reservieren von einer begrenzten Anzahl von Plätzen für einen bestimmten Zeitraum.

## Funktionen
- Loginsystem, Benutzer anlegen
- Tag und Zeit auswählen und bestimmte Anzahl von Plätzen reservieren
- UI mit Kalenderdarstellung

## Technologie 
- Webapp in React
- Datenbanksystem mit Express.js REST-API
- MySQL Datenbank

## Dokumentation
### API
OpenAPI Dokumentation: [hier](https://app.swaggerhub.com/apis-docs/BenediktWehner/reservierungssystem/0.0.01)

Postman Collection: [hier](https://www.postman.com/reservationsystemfbs/workspace/reservierungssystem/collection/30807855-afe18e57-d42c-44cd-8d73-c06333a054b4?action=share&creator=30807855)

Benutzeranleitung: [hier](https://github.com/bennewehn/reservierungssystem-fbs/blob/main/doc/Benutzeranleitung.pdf)

## Installation
### Docker
Laden der Images von docker-hub:
```
docker pull benewehn/reservierungssystem-fbs:v1.0-api
docker pull benewehn/reservierungssystem-fbs:v1.0-web
docker pull benewehn/reservierungssystem-fbs:v1.0-db
```
Beispiel docker-compose:
```
version: '3.8'

services:
  mysql:
    image: benewehn/reservierungssystem-fbs:v1.0-db
    environment:
      MYSQL_USER: testuser
      MYSQL_PASSWORD: testpassword
      MYSQL_ROOT_PASSWORD: root
    ports:
      - "3306:3306"

  web:
    image: benewehn/reservierungssystem-fbs:v1.0-web
    environment:
      API_URL: http://192.168.178.89:3001
    ports:
      - "8000:80"

  api:
    image: benewehn/reservierungssystem-fbs:v1.0-api
    ports:
      - "3001:3001"
    environment:
      WEB_URL: http://192.168.178.89:8000
      DB_HOST: mysql
      DB_USER: root
      DB_PASSWORD: root
      TOKEN_SECRET: a521483f0d5a0497d6a32a8178e93fca52ece353ed8c8337bc8894584ebbe57224d7dfbb37a5241ca45f1bfe150fc22d323ca80e76ff213e7b44ac791e9b8467
      REFRESH_TOKEN_SECRET: 404ce7a06fbdad181b859c8e394d81f075a9873a2e13b9568c635ba788b25a8ad58e2d06c0ae63aa550c074012997835197c255b0a85b498440d3011514c837d
      REFRESH_TOKEN_EXPIRATION: 86400
      ACCESS_TOKEN_EXPIRATION: 3000
```
Beispiel Secrets generieren in js:
```js
crypto.randomBytes(64).toString("hex");
```
docker-compose starten:
```
docker-compose up
```
