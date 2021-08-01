import { BaseError } from './BaseError';
interface IMissing {
	name: string;
	description?: string;
	type: string;
}
export class MissingError extends BaseError {
	public error: string = '';
	public message: string = '[MISSING_DATA] A data is missing for this request.';
	constructor(missings?: Array<IMissing>) {
		super('error', 400)
		this.error += this.message;
		if (missings && missings.length) {
			this.error += `\nMissing ${missings.map(m => `${m.type} ${m.name} ${(m.description ? `(${m.description})` : '')}`)}`
		}
	}
}
