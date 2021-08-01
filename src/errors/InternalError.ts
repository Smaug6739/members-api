import { BaseError } from './BaseError';

export class InternalError extends BaseError {

	public error: string = '';
	public message: string = '[INTERNAL_ERROR] An server error occurred.';

	constructor() {
		super('error', 500)
		this.error += this.message;
	}
}
