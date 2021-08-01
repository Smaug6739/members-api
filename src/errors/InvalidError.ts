import { BaseError } from './BaseError';

export class InvalidError extends BaseError {
	public error: string = '';
	public message: string = '[INVALID_DATA] A parameter or query is invalid for this request.';
	constructor(invalids?: Array<string>) {
		super('error', 406)
		this.error += this.message;
		if (invalids && invalids.length) {
			this.error += `\n${invalids.map(i => `\nParameter ${i} is invalid`)}`
		}
	}
}
