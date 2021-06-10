const str = "0000000011001010110111101111100000101110000000100000000000000001000000000000";
11001010110111101111100000101110000000100000000000000000000000000000

function binaryToDecimal(str) {
	const numbers = str.split('');
	let result = 0;
	let pow = numbers.length - 1;
	for (number of numbers) {
		const int = parseInt(number)
		result += (int * Math.pow(2, pow));
		pow--;
	}
	result.toString().padStart(32, '0');
	return result;
}

function decimalToBinary(decimal) {
	return decimal.toString(2)
}
const id = binaryToDecimal(str)
const re = decimalToBinary(id)
console.log(id);
console.log(re);
