export default class Identificator {
	public static INCREMENT = 0;
	public static EPOCH = 1609455600000;
	static generate(type: number, timestamp: any = Date.now()) {
		if (timestamp instanceof Date) timestamp = timestamp.getTime();
		if (typeof timestamp !== 'number' || isNaN(timestamp)) {
			throw new TypeError(
				`"timestamp" argument must be a number (received ${isNaN(timestamp) ? 'NaN' : typeof timestamp})`,
			);
		}
		if (this.INCREMENT >= 4095) this.INCREMENT = 0;
		const BINARY = `${(timestamp - this.EPOCH).toString(2).padStart(42, '0')}${(type)
			.toString(2)
			.padStart(12, '0')}0000100000${(this.INCREMENT++)
				.toString(2)
				.padStart(12, '0')}`;
		return this.binaryToID(BINARY);
	}
	static binaryToID(num: any) {
		let dec = '';
		while (num.length > 50) {
			const high = parseInt(num.slice(0, -32), 2);
			const low = parseInt((high % 10).toString(2) + num.slice(-32), 2);
			dec = (low % 10).toString() + dec;
			num =
				Math.floor(high / 10).toString(2) +
				Math.floor(low / 10)
					.toString(2)
					.padStart(32, '0');
		}

		num = parseInt(num, 2);
		while (num > 0) {
			dec = (num % 10).toString() + dec;
			num = Math.floor(num / 10);
		}

		return dec;
	}
	static idToBinary(num: string): any {
		let bin = '';
		let high = parseInt(num.slice(0, -10)) || 0;
		let low = parseInt(num.slice(-10));
		while (low > 0 || high > 0) {
			bin = String(low & 1) + bin;
			low = Math.floor(low / 2);
			if (high > 0) {
				low += 5000000000 * (high % 2);
				high = Math.floor(high / 2);
			}
		}
		return bin;
	}
	static deconstruct(snowflake: string) {
		const BINARY = this.idToBinary(snowflake).toString(2).padStart(76, '0');
		const res = {
			id: snowflake,
			timestamp: parseInt(BINARY.substring(0, 42), 2) + this.EPOCH,
			type: parseInt(BINARY.substring(42, 54), 2),
			workerID: parseInt(BINARY.substring(54, 59), 2),
			processID: parseInt(BINARY.substring(59, 64), 2),
			increment: parseInt(BINARY.substring(64, 76), 2),
			binary: BINARY,
		};
		Object.defineProperty(res, 'date', {
			get: function get() {
				return new Date(this.timestamp);
			},
			enumerable: true,
		});
		return res;
	}
}