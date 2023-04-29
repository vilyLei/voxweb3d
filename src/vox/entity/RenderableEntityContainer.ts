/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import DisplayEntityContainer from "./DisplayEntityContainer";
/**
 * 可直接用于容器层次规则渲染的容器
 */
export default class RenderableEntityContainer extends DisplayEntityContainer {
	/**
	 * @param renderingFlow the defaule value is true
	 */
	constructor(renderingFlow: boolean = true, spaceEnabled = true) {
		super(true, spaceEnabled, renderingFlow);;
	}
}
