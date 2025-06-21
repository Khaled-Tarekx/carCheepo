class PostNotFound extends Error {
	constructor() {
		super('Couldnt find a post correctly, maybe check the given ID');
		this.name = 'PostNotFound';
	}
}
class PostCreationFailed extends Error {
	constructor() {
		super('post failed at creation, maybe check the given input');
		this.name = 'PostCreationFailed';
	}
}
class PostEditingFailed extends Error {
	constructor() {
		super('couldnt edit the post correctly, maybe check the given id');
		this.name = 'PostEditingFailed';
	}
}

class PostDeletionFailed extends Error {
	constructor() {
		super('post failed in the deleting process');
		this.name = 'PostDeletionFailed';
	}
}

export {
	PostNotFound,
	PostEditingFailed,
	PostCreationFailed,
	PostDeletionFailed,
};
