export class ApiError extends Error {
  status;
  errors;

  constructor(status: number, message: string, errors = []) {
    super(message);
    this.status = status;
    this.errors = errors;
  }

  static Forbidden() {
    return new ApiError(403, 'У вас нет доступа');
  }

  static UnauthorizedError() {
    return new ApiError(401, 'Пользователь не авторизован');
  }

  static BadRequest(message: string, errors = [] as any) {
    return new ApiError(400, message, errors);
  }
}
