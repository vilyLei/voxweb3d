/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IEventBase from "./IEventBase";

export default interface IEvtNode {
    /**
     * the default value is 0
     */
    type: number;
    createEvent(target?: any, currentTarget?: any): IEventBase;
    /**
     * @param target listener host
     * @param func listener function
     * @param phase the default value is 0
     */
    addListener(target: any, func: (evt: any) => void, phase?: number): void;
    removeListener(target: any, func: (evt: any) => void): void;

    // @return      1 is send evt yes,0 is send evt no
    dispatch(evt: IEventBase): number;
    //@return if the evt can be dispatched in this node,it returns 1,otherwise it returns 0
    passTestEvt(evt: IEventBase): number;
    passTestPhase(phase: number): number;
    destroy(): void;
}