import IRenderTexture from "../../../vox/render/texture/IRenderTexture";
import ITransformEntity from "../../../vox/entity/ITransformEntity";
import IVector3D from "../../../vox/math/IVector3D";

interface IBillboardBase {

	brightnessEnabled: boolean;
	alphaEnabled: boolean;
	rotationEnabled: boolean;
	fogEnabled: boolean;
	entity: ITransformEntity;
	
	setVisible(v: boolean): void;
	getVisible(): boolean;

	toTransparentBlend(always?: boolean): void;
	toBrightnessBlend(always?: boolean): void;

	setRGBA4f(pr: number, pg: number, pb: number, pa: number): void;
	setRGB3f(pr: number, pg: number, pb: number): void;
	setFadeFactor(pa: number): void;
	getFadeFactor(): number;

	setRGBAOffset4f(pr: number, pg: number, pb: number, pa: number): void;
	setRGBOffset3f(pr: number, pg: number, pb: number): void;
	getRotationZ(): number;
	setRotationZ(degrees: number): void;
	getScaleX(): number;
	getScaleY(): number;
	setScaleX(p: number): void;
	setScaleY(p: number): void;
	setScaleXY(sx: number, sy: number): void;
	setXYZ(px: number, py: number, pz: number): void;
	setPosition(pos: IVector3D): void;
	/**
	 * 设置深度偏移量
	 * @param offset the value range: [-2.0 -> 2.0]
	 */
	setDepthOffset(offset: number): void;
	getUniformData(): Float32Array;
	update(): void;
	destroy(): void;
}
export { IBillboardBase }