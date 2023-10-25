import { ZodError } from "zod";

export enum ErrorCode {
  NotFound = 'NOT_FOUND',
  InternalServerError = 'INTERNAL_SERVER_ERROR',
  InvalidArgument = 'INVALID_ARGUMENT',
  PermissionDenied = 'PERMISSION_DENIED',
}

export class InternalServerError extends Error {
  constructor(message?: string) {
    super(message ?? 'Internal Server Error');
  }
}

export class NotFoundError extends Error {
  constructor(message?: string) {
    super(message ?? 'Not found');
  }
}

export class InvalidArgumentError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class PermissionDeniedError extends Error {
  constructor(message?: string) {
    super(message ?? 'permission denied');
  }
}


export function formatZodError(err: ZodError): string {
  let message = '';

  if (err.issues.length > 0) {
    const firstIssue = err.issues[0];
    message = `${firstIssue.path}: ${firstIssue.message}`;
  }

  return message;
}
