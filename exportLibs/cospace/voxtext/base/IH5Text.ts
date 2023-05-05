/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import { IBytesTexture } from "../../../vox/render/texture/IBytesTexture";
import IRendererScene from "../../../vox/scene/IRendererScene";

interface IFontTexCharGrid {
	width: number;
	height: number;
	x: number;
	y: number;
	uvs: Float32Array;
}
interface IFontTexCharTable {
	
	addCharsByRawData(chars: string, layoutData: string): void;
	addUV8RawDataFromChar(char: string, px: number, py: number, pw: number, ph: number): void;
	getGridByChar(char: string): IFontTexCharGrid;
	getUV8FromChar(char: string, outfloat8Arr: Float32Array, offset?: number): void;
	getVtxFromChar(char: string, vtxFloatArr: Float32Array, offset?: number): void;
	getUV8AndVtxFromChar(char: string, outFloatArr: Float32Array, vtxFloatArr: Float32Array, offsetuv?: number, offsetvtx?: number): void;

	getUV8AndSizeFromChar(char: string, outFloatArr: Float32Array, sizeArr: number[], offsetuv?: number): void;

	getUV8AndOffsetXYVtxFromChar(
		char: string,
		outUint8Arr: Uint8Array,
		vtxFloatArr: Float32Array,
		offsetX?: number,
		offsetY?: number,
		offsetuv?: number,
		offsetvtx?: number
	): void;
}

interface IH5Text {

	isEnabled(): boolean;
	getFontSize(): number;
	initialize(
		rscene: IRendererScene,
		canvas_id_name: string,
		fontSize?: number,
		texWidth?: number,
		texHeight?: number,
		canvasVisible?: boolean,
		mipmapEnabled?: boolean
	): void;
	setStyleSize(pw: number, ph: number): void;
	setCanvasVisible(bool: boolean): void;
	getUV8FromChar(char: string, outfloat8Arr: Float32Array, offset?: number): void;
	getCharTable(): IFontTexCharTable;

	createCharsTexFromStr(srcStr: string): void;
	getTextureAt(index?: number): IBytesTexture;
}
export { IFontTexCharGrid, IFontTexCharTable, IH5Text }