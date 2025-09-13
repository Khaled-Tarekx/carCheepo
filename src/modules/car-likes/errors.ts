export class CarLikeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CarLikeError';
  }
}

export class CarLikeNotFoundError extends CarLikeError {
  constructor() {
    super('Car like not found');
    this.name = 'CarLikeNotFoundError';
  }
}

export class CarLikeCreationError extends CarLikeError {
  constructor() {
    super('Failed to create car like');
    this.name = 'CarLikeCreationError';
  }
}

export class CarLikeDeletionError extends CarLikeError {
  constructor() {
    super('Failed to delete car like');
    this.name = 'CarLikeDeletionError';
  }
}

export class CarLikeUpdateError extends CarLikeError {
  constructor() {
    super('Failed to update car like');
    this.name = 'CarLikeUpdateError';
  }
}

export class UserAlreadyLikedCarError extends CarLikeError {
  constructor() {
    super('User already liked this car');
    this.name = 'UserAlreadyLikedCarError';
  }
}