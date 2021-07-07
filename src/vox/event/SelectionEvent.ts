/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import EventBase from "./EventBase";
export default class SelectionEvent extends EventBase
{
    static SELECT:number = 3201;
    uuid:string = "SelectionEvent";
    flag: boolean = true;
    constructor()
    {
        super();
        this.type = SelectionEvent.SELECT;
    }
    toString():string
    {
        return "[SelectionEvent]";
    }
}
