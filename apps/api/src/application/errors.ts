export type ApplicationErrorCode =
  'BAD_USER_INPUT' | 'NOT_FOUND' | 'UPSTREAM_SERVICE_UNAVAILABLE';

export abstract class ApplicationError extends Error {
  protected constructor(
    message: string,
    readonly code: ApplicationErrorCode,
    readonly status: number,
  ) {
    super(message);
    this.name = new.target.name;
  }
}

export class UserInputError extends ApplicationError {
  constructor(message: string) {
    super(message, 'BAD_USER_INPUT', 400);
  }
}

export class NotFoundError extends ApplicationError {
  constructor(message: string) {
    super(message, 'NOT_FOUND', 404);
  }
}

export class UpstreamError extends ApplicationError {
  constructor(message: string) {
    super(message, 'UPSTREAM_SERVICE_UNAVAILABLE', 503);
  }
}
