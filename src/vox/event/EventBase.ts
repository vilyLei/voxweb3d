/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
// 基本事件类
import IEventBase from "./IEventBase";
class EventBase implements IEventBase {
    static EventClassType: number = 1001;
    uuid: string = "";
    constructor() {
    }
    static RESIZE: number = 3001;
    static ENTER_FRAME: number = 3002;
    //classType:number = 1001;
    getClassType(): number {
        return EventBase.EventClassType;
    }

    // phase is event flow phase: 0(none phase),1(capture phase),2(bubble phase)
    phase: number = 0;
    // 事件类型
    type: number = EventBase.RESIZE;
    // 元事件发送者
    target: any = null;
    // 逻辑事件产生者, 例如容器发送了一个mouse down事件, 则容器是target而ray pick到的这个 entity就是currentTarget
    currentTarget: any = null;
    data: any = null;
    __$preventBoo: boolean = false;
    preventDefault(): void {
        this.__$preventBoo = true;
    }
    reset(): void {
        this.__$preventBoo = false;
    }
    toString(): string {
        return "[EventBase]";
    }
}
export default EventBase;