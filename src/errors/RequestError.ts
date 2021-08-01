import { BaseError } from './BaseError';

export class RequestError extends BaseError {

	public error: string = '';
	public message: string = '[REQUEST_ERROR] The request failed.';

	constructor(httpCode: number, msg: string) {
		super('error', httpCode)
		this.error += this.message;
		this.error += msg
	}
}
