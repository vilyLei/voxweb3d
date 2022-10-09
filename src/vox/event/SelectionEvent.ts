/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import EventBase from "./EventBase";
import ISelectionEvent from "./ISelectionEvent";
export default class SelectionEvent extends EventBase implements ISelectionEvent{
    static SELECT: number = 3201;

    flag: boolean = true;
    constructor() {
        super();
        this.type = SelectionEvent.SELECT;
    }
}
