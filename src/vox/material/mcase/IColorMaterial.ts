/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IRenderMaterial from "../../../vox/render/IRenderMaterial";
import IColor4 from "../IColor4";

export default interface IColorMaterial extends IRenderMaterial {

    premultiplyAlpha: boolean;
    normalEnabled: boolean;
    shadowReceiveEnabled: boolean;
    setRGB3f(pr: number, pg: number, pb: number): void;
    setRGBA4f(pr: number, pg: number, pb: number, pa: number): void;
    setAlpha(pa: number): void;
    getAlpha(): number;
    setColor(color: IColor4): void;
    getColor(color: IColor4): void;
}