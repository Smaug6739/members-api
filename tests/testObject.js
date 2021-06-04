const object = {
	a: 'a',
	b: 'b',
	c: 'c'
}
const ob = {
	d: 'd',
	a: 'a'
}
console.log({ ...object, ...ob });