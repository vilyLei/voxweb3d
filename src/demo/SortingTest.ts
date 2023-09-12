class DataObj {
	index = 0;
	value = 0;
	constructor() {}
}
export class SortingTest {
	constructor() {}

	private sortingIter2(arr: number[], low: number, high: number): number {
		let value = arr[low];
		while (low < high) {
			while (low < high && arr[high] >= value) {
				--high;
			}
			arr[low] = arr[high];

			while (low < high && arr[low] <= value) {
				++low;
			}
			arr[high] = arr[low];
		}
		arr[low] = value;
		return low;
	}
	private sortIter2(arr: number[], low: number, high: number): void {
		if (low != high) {
			let i = this.sortingIter2(arr, low, high);
			let j = i;
			if (i != low) {
				--i;
			}
			if (j != high) {
				++j;
			}
			this.sortIter2(arr, low, i);
			this.sortIter2(arr, j, high);
		}
	}
	private setData(arr: number[]): void {
		let total = arr.length;
		for (let i = 0; i < total; ++i) {
			// arr[i] = total - i - 1;
			arr[i] = (Math.random() * 200000.0 - 100000.0) | 0;
		}
	}
	private listPartitionOk<T>(arr: T[], a: number, b: number, comp: (v: T) => boolean): number {
		let total = 0;
		for (let i = a; i != b; ++i) {
			total += comp(arr[i]) ? 1 : 0;
		}
		let it = a;
		let maxIt = a + total;
		let rIt = maxIt;
		for (; total > 0; --total) {
			if (!comp(arr[it])) {
				for (; maxIt != b; ) {
					if (comp(arr[maxIt])) {
						const p = arr[it];
						arr[it] = arr[maxIt];
						arr[maxIt] = p;
						break;
					}
					++maxIt;
				}
			}
			++it;
		}
		return rIt;
	}
	private listPartition<T>(arr: T[], a: number, b: number, comp: (v: T) => boolean): number {
		let total = 0;
		for (let i = a; i != b; ++i) {
			// total += comp(arr[i]) ? 1 : 0;
			if(comp(arr[i])) {
				total ++;
			}
		}
		// let i = a;
		// total += comp(arr[i]) ? 1 : 0;
		// ++i;
		// for (; i != b; ++i) {
		// 	// total += comp(arr[i]) ? 1 : 0;
		// 	if(comp(arr[i])) {
		// 		total += 1;
		// 		if(arr[i-1] > arr[i]) {
		// 			const p = arr[i];
		// 			arr[i] = arr[i-1];
		// 			arr[i-1] = p;
		// 		}
		// 	}
		// }
		let it = a;
		let maxIt = a + total;
		let rIt = maxIt;
		for (; total > 0; --total) {
			if (!comp(arr[it])) {
				for (; maxIt != b; ) {
					if (comp(arr[maxIt])) {
						const p = arr[it];
						arr[it] = arr[maxIt];
						arr[maxIt] = p;
						break;
					}
					++maxIt;
				}
			}
			++it;
		}
		return rIt;
	}
	listQNumbSort(arr: number[], a: number, b: number): void {
		if (a != b) {
			let i = a + ((0.5 * (b - a)) | 0);
			let value = arr[i];
			let p0 = this.listPartition(arr, a, b, (v: number): boolean => {
				return v < value;
			});
			let p1 = this.listPartition(arr, p0, b, (v: number): boolean => {
				return v <= value;
			});
			this.listQNumbSort(arr, a, p0);
			this.listQNumbSort(arr, p1, b);
		}
	}

	private listPartition2<T>(arr: T[], value: T, a: number, b: number, comp: (v: T, value: T) => boolean): number {
		let total = 0;
		for (let i = a; i != b; ++i) {
			total += comp(arr[i], value) ? 1 : 0;
		}
		let it = a;
		let maxIt = a + total;
		let rIt = maxIt;
		for (; total > 0; --total) {
			if (!comp(arr[it], value)) {
				for (; maxIt != b; ) {
					if (comp(arr[maxIt], value)) {
						const p = arr[it];
						arr[it] = arr[maxIt];
						arr[maxIt] = p;
						break;
					}
					++maxIt;
				}
			}
			++it;
		}
		return rIt;
	}
	listQSort<T>(arr: T[], a: number, b: number, comp0: (v: T, value: T) => boolean, comp1: (v: T, value: T) => boolean): void {
		if (a != b) {
			let i: number = a + ((0.5 * (b - a)) | 0);
			let value = arr[i];
			let p0 = this.listPartition2(arr, value, a, b, comp0);
			let p1 = this.listPartition2(arr, value, p0, b, comp1);
			this.listQSort(arr, a, p0, comp0, comp1);
			this.listQSort(arr, p1, b, comp0, comp1);
		}
	}
	private mListTotal = 8192 << 4;
	private test01(): void {
		let total = this.mListTotal;
		// total = 16;
		let enabled = total <= 16;
		let arr: number[] = new Array(total);
		this.setData(arr);
		if (enabled) {
			console.log("arr init: ", arr);
		}
		let start_time = Date.now();
		this.sortIter2(arr, 0, total - 1);
		let end_time = Date.now();
		console.log("loss time: ", end_time - start_time, "ms");
		if (enabled) {
			console.log("arr sort: ", arr);
		}
	}
	private test02(): void {
		let total = this.mListTotal;
		// total = 16;
		let enabled = total <= 16;

		let arr: number[] = new Array(total);
		this.setData(arr);

		if (enabled) {
			console.log("test02(), arr init: ", arr);
		}
		let start_time = Date.now();

		this.listQNumbSort(arr, 0, total);

		let end_time = Date.now();
		console.log("test02(), loss time: ", end_time - start_time, "ms");
		if (enabled) {
			console.log("test02(), arr sort: ", arr);
		}
	}

	private test02_a(): void {
		let total = this.mListTotal;
		// total = 16;
		let enabled = total <= 16;

		let arr: number[] = new Array(total);
		this.setData(arr);
		function compareFn(a: number, b: number): number {
			if (a < b) {
				return -1;
			} else if (a > b) {
				return 1;
			}
			return 0;
		}
		if (enabled) {
			console.log("test02_a(), arr init: ", arr);
		}
		let start_time = Date.now();
		arr.sort(compareFn);
		// this.listQNumbSort(arr, 0, total);

		let end_time = Date.now();
		console.log("test02_a(), loss time: ", end_time - start_time, "ms");
		if (enabled) {
			console.log("test02_a(), arr sort: ", arr);
		}
	}
	private test03(): void {
		let total = this.mListTotal;
		// total = 16;
		let enabled = total <= 16;

		let arr: DataObj[] = new Array(total);
		for (let i = 0; i < total; ++i) {
			let obj = new DataObj();
			obj.index = i;
			obj.value = (Math.random() * 200000.0 - 100000.0) | 0;
			arr[i] = obj;
		}

		if (enabled) {
			console.log("test03(), arr init: ", arr);
		}
		let start_time = Date.now();

		let comp0 = (v: DataObj, value: DataObj): boolean => {
			return v.value < value.value;
		};
		let comp1 = (v: DataObj, value: DataObj): boolean => {
			return v.value <= value.value;
		};
		this.listQSort(arr, 0, total, comp0, comp1);

		let end_time = Date.now();
		console.log("test03(), loss time: ", end_time - start_time, "ms");
		if (enabled) {
			console.log("test03(), arr sort: ", arr);
		}
	}
	private test03_a(): void {
		let total = this.mListTotal;
		// total = 16;
		let enabled = total <= 16;

		let arr: DataObj[] = new Array(total);
		for (let i = 0; i < total; ++i) {
			let obj = new DataObj();
			obj.index = i;
			obj.value = (Math.random() * 200000.0 - 100000.0) | 0;
			arr[i] = obj;
		}
		function compareFn(a: DataObj, b: DataObj): number {
			if (a.value < b.value) {
				return -1;
			} else if (a.value > b.value) {
				return 1;
			}
			return 0;
		}
		if (enabled) {
			console.log("test03_a(), arr init: ", arr);
		}
		let start_time = Date.now();
		arr.sort(compareFn);

		let end_time = Date.now();
		console.log("test03_a(), loss time: ", end_time - start_time, "ms");
		if (enabled) {
			console.log("test03_a(), arr sort: ", arr);
		}
	}
	insertionSort(arr: number[]): void {
		let len = arr.length;
		let preIndex, current;
		for (var i = 1; i < len; i++) {
			preIndex = i - 1;
			current = arr[i];
			while(preIndex >= 0 && arr[preIndex] > current) {
				arr[preIndex+1] = arr[preIndex];
				preIndex--;
			}
			arr[preIndex+1] = current;
		}
	}

	private test_select(): void {
		let total = this.mListTotal;
		// total = 16;
		let enabled = total <= 16;

		let arr: number[] = new Array(total);
		this.setData(arr);
		function compareFn(a: number, b: number): number {
			if (a < b) {
				return -1;
			} else if (a > b) {
				return 1;
			}
			return 0;
		}
		if (enabled) {
			console.log("test_select(), arr init: ", arr);
		}
		let start_time = Date.now();
		this.insertionSort( arr );

		let end_time = Date.now();
		console.log("test_select(), loss time: ", end_time - start_time, "ms");
		if (enabled) {
			console.log("test_select(), arr sort: ", arr);
		}
	}
	initialize(): void {
		console.log("SortingTest::initialize() ... ...");

		console.log("initialize(), this.mListTotal: ", this.mListTotal);
		// if (this.mListTotal <= 4096) {
		// 	this.test01();
		// }
		this.test02();
		this.test02_a();
		// if (this.mListTotal <= 8192) {
		// 	// 数据太多速度太慢
		// 	this.test_select();
		// }
		// this.test03();
		// this.test03_a();
	}
}
export default SortingTest;
