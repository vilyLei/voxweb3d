/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ITransformEntity from "../../../vox/entity/ITransformEntity";
import IRenderTexture from "../../../vox/render/texture/IRenderTexture";
import IVector3D from "../../../vox/math/IVector3D";
import { IH5Text } from "./IH5Text";

interface ITextEntity {
    /**
     * the default value is false
     */
    flipVerticalUV: boolean;
    getREntity(): ITransformEntity;
    getWidth(): number;
    getHeight(): number;
    setAlignFactor(alignFactorX: number, alignFactorY: number): void;
    alignLeftTop(): void;
    alignCenter(): void;
    alignLeftCenter(): void;
    setText(charsStr: string): void;
    setRGBA4f(pr: number, pg: number, pb: number, pa: number): void;
    setRGB3f(pr: number, pg: number, pb: number): void;
    setAlpha(pa: number): void;
    getAlpha(): number;
    setBrightness(brighness: number): void;
    getBrightness(): number;
    getRotationZ(): number;
    setRotationZ(degrees: number): void;
    getScaleX(): number;
    getScaleY(): number;
    setScaleX(p: number): void;
    setScaleY(p: number): void;
    setScaleXY(sx: number, sy: number): void;
    setXYZ(px: number, py: number, pz: number): void;
    setPosition(pv: IVector3D): void;
    getPosition(pv: IVector3D): IVector3D;
    initialize(text: string, h5Text: IH5Text, texList?: IRenderTexture[]): void;
    
    update(): void;
    destroy(): void;
}
export { ITextEntity }
