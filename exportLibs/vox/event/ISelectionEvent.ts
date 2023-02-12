/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
// 基本事件类

import IEventBase from "./IEventBase";
interface ISelectionEvent extends IEventBase {
    /**
	 * the default value is false
	 */
	flag: boolean;
}
export default ISelectionEvent;