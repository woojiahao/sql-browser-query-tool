import { HttpException, HttpStatus } from '@nestjs/common';

export class TableNotFoundError extends HttpException {
  constructor() {
    super('Table not found', HttpStatus.BAD_REQUEST);
  }
}

export class ForbiddenOperationError extends HttpException {
  constructor() {
    super(
      'Not allowed to perform operation. Only use SELECT!',
      HttpStatus.FORBIDDEN,
    );
  }
}
