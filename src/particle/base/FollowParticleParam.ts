/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Vector3D from "../../vox/math/Vector3D";
import Color4 from "../../vox/material/Color4";
import IRenderTexture from "../../vox/render/texture/IRenderTexture";

class FollowParticleParam {

	protected m_color = new Color4();
	constructor() {
	}
	setSizeParam(sizeBase: number, sizeRange: number, sizeScaleMin: number = 0.2, sizeScaleMax: number = 2.0): void {
		this.sizeParam.setTo(sizeBase, sizeRange, sizeScaleMin, sizeScaleMax);
	}
	getColor(i: number): Color4 {
		this.m_color.randomRGB();
		return this.m_color;
	}
	getBrnOrAlpha(i: number): number {
		return this.brnOrAlpha + Math.random() * this.brnOrAlphaRange;
	}

	getUVRectAt(i: number): number[] {
		const rn = this.clipRN;
		const cn = this.clipCN;
		let ri = Math.round(1000 * Math.random()) % rn;
		let ci = Math.round(1000 * Math.random()) % cn;
		let dw = 1.0 / cn;
		let dh = 1.0 / rn;
		return [ci * dw, ri * dh, dw, dh];
	}
	getAreaUVRectAt(i: number): number[] {
		const rn = this.areaRN;
		const cn = this.areaCN;
		let ri = Math.round(1000 * Math.random()) % rn;
		let ci = Math.round(1000 * Math.random()) % cn;
		let dw = 1.0 / cn;
		let dh = 1.0 / rn;
		return [ci * dw, ri * dh, dw, dh];
	}

	brnOrAlpha = 0.5;
	brnOrAlphaRange = 0.5;

	textures: IRenderTexture[] = null;

	speedScale = 1.0;
	lifetimeScale = 1.0;
	sizeParam = new Vector3D(30, 10, 0.2, 2.0);
	accelerationScale = 0.001;

	brightnessEnabled = true;
	alphaEnabled = false;

	areaRN = 1;
	areaCN = 1;

	clipRN = 2;
	clipCN = 2;
	clipEnabled = false;
	direcEnabled = false;
	clipMixEnabled = false;

	flipVerticalUV = false;
	premultiplyAlpha = false;
	vtxColorEnabled = true;
	brnToAlpha = false;
	clipRectEnabled = false;
	vtxClipUVRectEnabled = false;

}
export { FollowParticleParam }
