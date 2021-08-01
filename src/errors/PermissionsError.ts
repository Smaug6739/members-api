import { BaseError } from './BaseError';

export class PermissionsError extends BaseError {

	public error: string = '';
	public message: string = '[BAD_PERMISSIONS] Permission denied for this action.';

	constructor(permissions?: string[]) {
		super('error', 403)
		this.error += this.message;
		if (permissions && permissions.length) {
			this.error += `You need ${permissions.join(', ')}`;
		}
	}
}
