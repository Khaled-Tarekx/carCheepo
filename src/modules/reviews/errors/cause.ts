class ReviewNotFound extends Error {
	constructor() {
		super('Couldnt find the review correctly, maybe check the given ID');
		this.name = 'ReviewNotFound';
	}
}
class ReviewCreationFailed extends Error {
	constructor() {
		super('review failed at creation , maybe check the given input');
		this.name = 'ReviewCreationFailed';
	}
}
class ReviewEditingFailed extends Error {
	constructor() {
		super('couldnt edit the review correctly, maybe check the given id');
		this.name = 'ReviewEditingFailed';
	}
}
class ReviewCountUpdateFailed extends Error {
	constructor() {
		super('review count failed to update in the post');
		this.name = 'ReviewCountUpdateFailed';
	}
}
class ReviewDeletionFailed extends Error {
	constructor() {
		super('review failed in the deleting process');
		this.name = 'ReviewDeletionFailed';
	}
}

export {
	ReviewNotFound,
	ReviewCreationFailed,
	ReviewCountUpdateFailed,
	ReviewEditingFailed,
	ReviewDeletionFailed,
};
