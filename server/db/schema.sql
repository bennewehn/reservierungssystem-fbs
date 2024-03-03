CREATE TABLE user(
	userId INT NOT NULL AUTO_INCREMENT,
	email VARCHAR(50) NOT NULL,
	firstName VARCHAR(50) NOT NULL,
	lastName VARCHAR(50) NOT NULL,
	password VARCHAR(60) NOT NULL,
	PRIMARY KEY(userId),
	UNIQUE (email)
);

CREATE TABLE reservation(
	rId INT NOT NULL AUTO_INCREMENT,
	user INT NOT NULL,
	startTime DATETIME NOT NULL,
	endTime DATETIME NOT NULL,
	count INT NOT NULL,
	PRIMARY KEY(rId),
	FOREIGN KEY(user) REFERENCES user(userId)
);

CREATE TABLE refreshToken(
	refreshTokenId INT NOT NULL AUTO_INCREMENT,
	userId INT NOT NULL,
	token VARCHAR(50) NOT NULL,
	expiryDate TIMESTAMP NOT NULL,
	PRIMARY KEY(refreshTokenId),
	FOREIGN KEY(userID) REFERENCES user(userId)
);