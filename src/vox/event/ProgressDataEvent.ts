/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import EventBase from "./EventBase";
export default class ProgressDataEvent extends EventBase
{
    static PROGRESS:number = 3101;
    status: number = 0;
    progress: number = 0.0;
    minValue: number = 0.0;
    maxValue: number = 1.0;
    value: number = 0.0;
    constructor()
    {
        super();
        this.type = ProgressDataEvent.PROGRESS;
    }
    toString():string
    {
        return "[ProgressDataEvent]";
    }
}
