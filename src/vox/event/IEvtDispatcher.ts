/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
interface IEvtDispatcher {
    uuid: string;
    data: any;
    currentTarget: any;
    enabled: boolean;
    destroy(): void;
    getClassType(): number;
    // @return      1 is send evt yes,0 is send evt no
    dispatchEvt(evt: any): number;
    // @return if the evt can be dispatched in this node,it returns 1,otherwise it returns 0
    passTestEvt(evt: any): number;
    // @return if the evt phase is in this node,it returns 1,otherwise it returns 0
    passTestPhase(phase: number): number;
    addEventListener(type: number, listener: any, func: (evt: any) => void, captureEnabled?: boolean, bubbleEnabled?: boolean): void
    removeEventListener(type: number, listener: any, func: (evt: any) => void): void;
}

export default IEvtDispatcher;
