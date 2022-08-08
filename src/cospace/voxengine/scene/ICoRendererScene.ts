/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

// import IRenderer from "../../../vox/scene/IRenderer";
import IRendererScene from "../../../vox/scene/IRendererScene";
import IRendererParam from "../../../vox/scene/IRendererParam";


interface ICoRendererScene extends IRendererScene {
	initialize(rparam?: IRendererParam, renderProcessesTotal?: number): void;
}
export { ICoRendererScene }
