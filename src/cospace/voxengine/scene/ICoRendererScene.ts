/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IRendererScene from "../../../vox/scene/IRendererScene";
import IRendererParam from "../../../vox/scene/IRendererParam";
import ICoRenderNode from "./ICoRenderNode";


interface ICoRendererScene extends IRendererScene {
	initialize(rparam?: IRendererParam, renderProcessesTotal?: number): void;
	prependRenderNode(node: ICoRenderNode): void;
	appendRenderNode(node: ICoRenderNode): void;
	removeRenderNode(node: ICoRenderNode): void;
}
export { ICoRendererScene }
