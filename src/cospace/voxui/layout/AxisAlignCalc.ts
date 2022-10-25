class AxisAlignCalc {
	constructor() { }
	calcRange(centerPercent: number, size: number, factor = 0.7): number[] {
		if (centerPercent < 0.0) centerPercent = 0.0;
		else if (centerPercent > 1.0) centerPercent = 1.0;
		if (factor < 0.0) factor = 0.0;
		else if (factor > 1.0) factor = 1.0;
		let content = size * (1.0 - factor);
		let p = centerPercent * size;
		let max = p + content * 0.5;
		if (max > size) max = size;
		let min = max - content;
		return [min, max];
	}
	avgLayout(sizes: number[], min: number, max: number): number[] {

		if (sizes != null && sizes.length > 0) {
			let len = sizes.length;
			switch (len) {
				case 1:
					let px = 0.5 * (max - min) + min;
					return [px - 0.5 * sizes[0]];
					break;
				default:
					return this.calcMulti(sizes, min, max);
					break;
			}
		}
		return null;
	}
	private calcMulti(sizes: number[], min: number, max: number): number[] {
		let dis = max - min;
		let len = sizes.length;
		let size = 0;
		for (let i = 0; i < len; i++) {
			size += sizes[i];
		}
		let list = new Array(len);
		list[0] = min;
		list[len - 1] = max - sizes[len - 1];

		if (len > 2) {
			if (size < dis) {
				let dl = (dis - size) / (len - 1);
				len--;
				for (let i = 1; i < len; i++) {
					list[i] = list[i - 1] + sizes[i - 1] + dl;
				}
			} else {				
				let p0 = (list[0] + 0.5 * sizes[0]);
				dis = (list[len - 1] + 0.5 * sizes[len - 1]) - p0;
				let dl = dis / (len - 1);
				p0 += dl;
				len--;
				for (let i = 1; i < len; i++) {
					list[i] = p0;
					p0 += dl;
				}
			}
		}
		return list;
	}
}

export { AxisAlignCalc };
