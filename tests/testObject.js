const object = {
	a: 'a',
	b: 'b',
	c: 'c'
}
const ob = {
	d: 'd',
	e: 'e'
}
const ac = undefined
console.log({
	...object, ...ob, result: {
		...ac
	}
});