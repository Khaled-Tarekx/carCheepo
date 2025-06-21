class ViewNotFound extends Error {
	constructor() {
		super('you havent view the following resource');
		this.name = 'ViewNotFound';
	}
}

class ViewCreationFailed extends Error {
	constructor() {
		super('like creation failed');
		this.name = 'LikeCreationFailed';
	}
}

class ViewCountUpdateFailed extends Error {
	constructor() {
		super('like count failed to update');
		this.name = 'LikeCountUpdateFailed';
	}
}

export { ViewNotFound, ViewCreationFailed, ViewCountUpdateFailed };
