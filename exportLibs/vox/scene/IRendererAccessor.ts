/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IRenderer from "./IRenderer";

interface IRendererAccessor {
    renderBegin(renderer: IRenderer): void;
    renderEnd(renderer: IRenderer): void;
}
export {IRendererAccessor};
