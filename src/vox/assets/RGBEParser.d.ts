
export interface RGBE {
	width: number;
	height: number;
	data: Float32Array | Uint8Array;
	header: string;
	gamma: number;
	exposure: number;
	format: number;
	type: number;
}

export class RGBEParser {

	constructor();
	type: number;

	parse( buffer: ArrayBuffer ): RGBE;
	setDataType( type: number ): this;

}
