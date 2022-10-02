export class HttpException extends Error {
  public status: number;
  public message: string;
  public customCode?: string;

  constructor(status: number, message: string, customCode?: string) {
    super(message);
    this.status = status;
    this.message = message;
    this.customCode = customCode
  }
}
