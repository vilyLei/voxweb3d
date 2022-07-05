
export class PNG {
	constructor(opt: {filterType:number});
	parse(buf: Uint8Array, callback: (err: Error, png: {data: Uint8Array,width: number, height: number}) => void): void;
}
