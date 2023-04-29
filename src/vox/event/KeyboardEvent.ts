/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import EventBase from "./EventBase";
class KeyboardEvent extends EventBase {
    static readonly EventClassType = 1003;

    static readonly KEY_DOWN = 6001;
    static readonly KEY_UP = 6002;

    getClassType(): number {
        return KeyboardEvent.EventClassType;
    }

    constructor() {
        super();
    }
    altKey = false;
    ctrlKey = false;
    shiftKey = false;
    repeat = false;
    key = "";
    keyCode = 0;
    location = 0;
}
export default KeyboardEvent;
