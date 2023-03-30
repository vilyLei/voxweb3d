/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import DisplayEntityContainer from "./DisplayEntityContainer";
/**
 * 可直接用于容器层次规则渲染的容器
 */
export default class RenderableEntityContainer extends DisplayEntityContainer {
	constructor(renderingFlow: boolean = true) {
		super(true, true, renderingFlow);;
	}
}
