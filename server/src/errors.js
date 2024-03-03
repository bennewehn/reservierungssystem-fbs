export class PasswordInvalidError extends Error{ 
    constructor(msg) { 
        super(msg); 
    } 
};
 
export class UserNotFoundError extends Error { 
    constructor(msg) { 
        super(msg); 
    } 
};

 
export class RefreshTokenNotValidError extends Error { 
    constructor(msg) { 
        super(msg); 
    } 
} 

export class RefreshTokenExpiredError extends Error { 
    constructor(msg) { 
        super(msg); 
    } 
} 

export class UserAlreadyExistsError extends Error { 
    constructor(msg) { 
        super(msg); 
    } 
} 