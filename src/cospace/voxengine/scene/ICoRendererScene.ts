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
	/**
	 * @param rparam IRendererParam instance
	 * @param renderProcessesTotal the default is 3
	 * @param createNewCamera the default is true
	 */
	initialize(rparam?: IRendererParam, renderProcessesTotal?: number, createNewCamera?: boolean): void;
	prependRenderNode(node: ICoRenderNode): void;
	appendRenderNode(node: ICoRenderNode): void;
	removeRenderNode(node: ICoRenderNode): void;
	/**
	 * @param rparam IRendererParam instance
	 * @param renderProcessesTotal the default is 3
	 * @param createNewCamera the default is true
	 */
	createSubScene(rparam?: IRendererParam, renderProcessesTotal?: number, createNewCamera?: boolean): ICoRendererScene;
	render(): void;
}
export { ICoRendererScene }
