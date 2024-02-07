CREATE TABLE benutzer (
	benutzerID INT NOT NULL AUTO_INCREMENT,
	vorname VARCHAR(50),
	nachname VARCHAR(50),
	benutzername VARCHAR(50),
	email VARCHAR(100),
	passwort VARCHAR(50),
	PRIMARY KEY(benutzerID)
);

CREATE TABLE Reservierung(
	rID INT NOT NULL AUTO_INCREMENT,
	bucher INT,
	datum DATE,
	zeitraum TIME,
	anzahlPCs INT,
	PRIMARY KEY(rID),
	FOREIGN KEY(bucher) REFERENCES benutzer(benutzerID)
);