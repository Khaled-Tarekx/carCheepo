class PasswordComparisionError extends Error {}
class PasswordHashingError extends Error {}
class LoginError extends Error {
	constructor() {
		super('either password or email is incorrect');
		this.name = 'LoginError';
	}
}
class RegistrationError extends Error {
	constructor() {
		super('all fields must be entered');
		this.name = 'RegistrationError';
	}
}
class UserNotFound extends Error {
	constructor() {
		super('couldnt find user with the given input');
		this.name = 'UserNotFound';
	}
}

class RefreshTokenNotFound extends Error {
	constructor() {
		super('couldnt find refresh token');
		this.name = 'RefreshTokenNotFound';
	}
}
class TokenCreationFailed extends Error {
	constructor() {
		super('failed to create the token');
		this.name = 'TokenCreationFailed';
	}
}
class TokenVerificationFailed extends Error {
	constructor() {
		super('failed to verify the token');
		this.name = 'TokenVerificationFailed';
	}
}

class CodeVerificationFailed extends Error {
	constructor() {
		super('the 6 digit code you entered was incorrect');
		this.name = 'CodeVerificationFailed';
	}
}

class UnAuthorized extends Error {
	constructor() {
		super('UnAuthorized');
		this.name = 'UnAuthorized';
	}
}

class PasswordMismatchedConfirm extends Error {
	constructor() {
		super("password doesn't match it's confirm value");
		this.name = 'PasswordMismatchedConfirm';
	}
}

export {
	CodeVerificationFailed,
	LoginError,
	PasswordMismatchedConfirm,
	UserNotFound,
	RegistrationError,
	TokenCreationFailed,
	PasswordComparisionError,
	PasswordHashingError,
	RefreshTokenNotFound,
	TokenVerificationFailed,
	UnAuthorized,
};
