export function hasPermissions(userPermissions: string[], permissionsRequested: string[]) {
	if (!userPermissions || userPermissions.length) return false;
	if (userPermissions.includes('ADMINISTRATOR')) return true;
	for (const permRequested of permissionsRequested) {
		if (!userPermissions.includes(permRequested)) return false;
	}
	return true;
}