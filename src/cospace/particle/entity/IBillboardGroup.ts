/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ITransformEntity from "../../../vox/entity/ITransformEntity";
import IRenderTexture from "../../../vox/render/texture/IRenderTexture";


export default interface IBillboardGroup {

	entity: ITransformEntity;
	vbWholeDataEnabled: boolean;
    flipVerticalUV: boolean;
    premultiplyAlpha: boolean;

    createGroup(billboardTotal: number): void;
    setSizeAndScaleAt(i: number, width: number, height: number, minScale: number, maxScale: number): void;
    setPositionAt(i: number, x: number, y: number, z: number): void;
    setVelocityAt(i: number, spdX: number, spdY: number, spdZ: number): void;
    setAccelerationAt(i: number, accX: number, accY: number, accZ: number): void;
    setUVRectAt(i: number, u: number, v: number, du: number, dv: number): void;
    setTimeAt(i: number, lifeTime: number, fadeInEndFactor: number, fadeOutBeginFactor: number, beginTime?: number): void;
    setTimeSpeedAt(i: number, beginTime: number): void;
    setTimeSpeed(i: number, timeSpeed: number): void;
    setAlphaAt(i: number, alpha: number): void;
    setBrightnessAt(i: number, brightness: number): void;

    setRGBA4f(pr: number, pg: number, pb: number, pa: number): void;
    setRGB3f(pr: number, pg: number, pb: number): void;

    setRGBAOffset4f(pr: number, pg: number, pb: number, pa: number): void;
    setRGBOffset3f(pr: number, pg: number, pb: number): void;

    setAlpha(pa: number): void;
    getAlpha(): number;
    setBrightness(brighness: number): void;
    getBrightness(): number;

    setAcceleration(accX: number, accY: number, accZ: number): void;
    setSpdScaleMax(spdScaleMax: number, factor?: number): void;
    setClipUVParam(cn: number, total: number, du: number, dv: number): void;
    getTime(): number;
    setTime(time: number): void;
    /**
     * 设置深度偏移量
     * @param offset the value range: [-2.0 -> 2.0]
     */
    setDepthOffset(offset: number): void;
    updateTime(timeOffset: number): void;
    getScaleX(): number;
    getScaleY(): number;
    setScaleX(p: number): void;
    setScaleY(p: number): void;
    setScaleXY(sx: number, sy: number): void;
    toTransparentBlend(always?: boolean): void;
    toBrightnessBlend(always?: boolean): void;
    setPlayParam(playOnce: boolean, direcEnabled?: boolean, clipMixEnabled?: boolean, spdScaleEnabled?: boolean): void;
    initialize(brightnessEnabled: boolean, alphaEnabled: boolean, clipEnabled: boolean, texList: IRenderTexture[]): void;

    setUV(pu: number, pv: number, du: number, dv: number): void;
    update(): void;
    isAwake(): boolean;
    destroy(): void;
}
