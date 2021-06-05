async function asyncF() {
	throw '{ t: "hey" }'
}
(async function () {
	try {
		const r = await asyncF()
		console.log(r);
	} catch (e) {
		console.log('catch');
		console.log(e);
	}
})()
