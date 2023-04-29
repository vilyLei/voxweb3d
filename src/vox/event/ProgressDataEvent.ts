/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import EventBase from "./EventBase";
import IProgressDataEvent from "./IProgressDataEvent";
export default class ProgressDataEvent extends EventBase implements IProgressDataEvent {
    static PROGRESS: number = 3101;
    status: number = 0;
    progress: number = 0.0;
    minValue: number = 0.0;
    maxValue: number = 1.0;
    value: number = 0.0;
    constructor() {
        super();
        this.type = ProgressDataEvent.PROGRESS;
    }
}
