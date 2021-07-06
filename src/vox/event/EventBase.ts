/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
// 基本事件类

class EventBase
{
    static EventClassType:number = 1001;
    constructor()
    {
    }
    static RESIZE:number = 3001;
    static ENTER_FRAME:number = 3002;
    //classType:number = 1001;
    getClassType():number
    {
        return EventBase.EventClassType;
    }
    
    // phase is event flow phase: 0(none phase),1(capture phase),2(bubble phase)
    phase:number = 0;
    // 事件类型
    type:number = EventBase.RESIZE;
    // 事件发送者
    target:any = null;
    __$preventBoo:boolean = false;
    preventDefault():void
    {
        this.__$preventBoo = true;
    }
    reset():void
    {
        this.__$preventBoo = false;
    }
    toString():string
    {
        return "[EventBase]";
    }
}
export default EventBase;