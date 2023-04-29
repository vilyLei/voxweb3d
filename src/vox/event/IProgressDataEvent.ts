/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IEventBase from "./IEventBase";
interface IProgressDataEvent extends IEventBase {

    /**
	 * the default value is 0
	 */
	status: number;
    /**
	 * the default value is 0.0
	 */
	progress: number;
	/**
	 * the default value is 0.0
	 */
    minValue: number;
	/**
	 * the default value is 1.0
	 */
    maxValue: number;	
	/**
	 * the default value is 0.0
	 */
    value: number;
}
export default IProgressDataEvent;