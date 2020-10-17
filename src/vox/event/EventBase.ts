/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
// 基本事件类

export namespace vox
{
    export namespace event
    {
        export class EventBase
        {
            static EventClassType:number = 1001;
            constructor()
            {
            }
            static RESIZE:number = 3001;

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
            toString():string
            {
                return "[EventBase]";
            }
        }
    }
}
