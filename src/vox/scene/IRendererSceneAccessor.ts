/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IRendererScene from "./IRendererScene";

interface IRendererSceneAccessor {
    renderBegin(rendererScene: IRendererScene): void;
    renderEnd(rendererScene: IRendererScene): void;
}
export {IRendererSceneAccessor};
