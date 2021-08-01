export class BaseError {
	status: string;
	httpCode: number;
	timestamp: number = Date.now();
	constructor(status: string, httpCode: number) {
		this.status = status;
		this.httpCode = httpCode;
	}
}