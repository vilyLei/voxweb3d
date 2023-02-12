/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
import IRenderEntity from "../render/IRenderEntity";

interface RendererEntityStatusListener {
    addToRenderer(entity: IRenderEntity, rendererUid: number, processUid: number): void;
    removeFromRenderer(entity: IRenderEntity, rendererUid: number, processUid: number): void;
}
export {RendererEntityStatusListener};