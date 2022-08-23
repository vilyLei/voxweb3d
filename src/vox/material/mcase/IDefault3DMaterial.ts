/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IRenderMaterial from "../../../vox/render/IRenderMaterial";
import IColor4 from "../IColor4";

export default interface IDefault3DMaterial extends IRenderMaterial {

    vertColorEnabled: boolean;
    premultiplyAlpha: boolean;
    normalEnabled: boolean;
    shadowReceiveEnabled: boolean;
    vtxMatrixTransform: boolean;

    setRGB3f(pr: number, pg: number, pb: number): void;
    getRGB3f(color: IColor4): void;
    setRGBA4f(pr: number, pg: number, pb: number, pa: number): void;
    getRGBA4f(color: IColor4): void;
    setAlpha(pa: number): void;
}