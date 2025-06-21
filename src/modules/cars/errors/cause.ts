class CarNotFound extends Error {
	constructor() {
		super('Couldnt find the car correctly, maybe check the given ID');
		this.name = 'CarNotFound';
	}
}
class CarCreationFailed extends Error {
	constructor() {
		super('car failed at creation, maybe check the given input');
		this.name = 'CarCreationFailed';
	}
}
class CarUpdateFailed extends Error {
	constructor() {
		super('couldnt update the car correctly, maybe check the given id');
		this.name = 'CarUpdateFailed';
	}
}

class CarCountUpdateFailed extends Error {
	constructor() {
		super('car count failed to update in the task');
		this.name = 'CarCountUpdateFailed';
	}
}
class CarDeletionFailed extends Error {
	constructor() {
		super('reply failed in the deleting process');
		this.name = 'CarDeletionFailed';
	}
}
class NoCarImageProvided extends Error {
	constructor() {
		super('car image not found');
		this.name = 'NoCarImageProvided';
	}
}

export {
	CarNotFound,
	CarCreationFailed,
	CarUpdateFailed,
	CarCountUpdateFailed,
	CarDeletionFailed,
	NoCarImageProvided,
};
