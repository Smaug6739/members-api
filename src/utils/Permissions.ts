class Permissions {
	private bits: number; // User bits permissions
	public FLAGS = [
		{ value: 1 << 1, name: 'ADMINISTRATOR' },
		{ value: 1 << 2, name: 'MANAGE_AUTHS' },
		{ value: 1 << 3, name: 'VIEW_ALL_MEMBERS' },
		{ value: 1 << 4, name: 'UPDATE_MEMBERS' },
		{ value: 1 << 5, name: 'DELETE_MEMBERS' },
		{ value: 1 << 6, name: 'BAN_MEMBERS' },
	]
	constructor(bits: number) {
		this.bits = bits;
	}
	get ALL() {
		let bit = 0;
		for (let flag of this.FLAGS) {
			bit += flag.value
		}
		return bit
	}
	get permissionCalc() {
		return this.bits;
	}
	public toArray() {

		let bits = this.bits;
		const flags = [...this.FLAGS].reverse()

		const userPermissions: any[] = []
		for (let permission of flags) {

			const rest = bits % permission.value;
			if (rest == 0 && bits != 0) {
				userPermissions.push(permission.name);
				break;
			}
			if (rest < bits) {
				userPermissions.push(permission.name);
				bits = rest
			}
		}
		return userPermissions
	}
	public hasPermissions(permission: any): boolean {
		if (Array.isArray(permission)) return permission.every(p => this.hasPermissions(p))
		const permissionsArray = this.toArray();
		if (permissionsArray.includes('ADMINISTRATOR')) return true;
		if (typeof permission === 'string') {


			if (permissionsArray.includes(permission)) return true;
			else return false;
		}
		if (typeof permission === 'number') {
			let hasPermissions = false;
			this.FLAGS.map(p => {
				if (p.value === permission) hasPermissions = true;
			})
			return hasPermissions;
		}
		return false
	}
	public calculate(permissions: string | string[]) {
		if (typeof permissions === 'string') {
			const permission = this.FLAGS.find(f => f.name === permissions.toUpperCase());
			return permission ? permission : undefined;
		}
		if (Array.isArray(permissions)) {
			let some = 0;
			permissions.map(p => {
				const permission = this.FLAGS.find(perm => perm.name === p.toUpperCase())
				if (permission) some += permission.value;
			})
		}
	}
}