/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IEventBase from "./IEventBase";
interface IKeyboardEvent extends IEventBase {
    altKey: boolean;
    ctrlKey: boolean;
    shiftKey: boolean;
    repeat: boolean;
    key: string;
    keyCode: number;
    location: number;
}
export default IKeyboardEvent;
