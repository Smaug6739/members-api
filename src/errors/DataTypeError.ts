import { BaseError } from './BaseError';

interface IInvalid {
	name: string;
	expected: string;
}
export class DataTypeError extends BaseError {

	public error: string = '';
	public message: string = '[TYPE_ERROR] Invalid argument type.';

	constructor(invalids?: IInvalid[]) {
		super('error', 400)
		this.error += this.message;
		if (invalids && invalids.length) {
			this.error += invalids.map(i => `\n${i.name} must be a ${i.expected}`);
		}
	}
}
