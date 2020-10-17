/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

export namespace vox
{
    export namespace event
    {
        export class KeyboardEvent
        {
            static EventClassType:number = 1003;
            constructor()
            {
            }
            
            static KEY_DOWN:number = 6001;
            static KEY_UP:number = 6002;
            
            getClassType():number
            {
                return KeyboardEvent.EventClassType;
            }
            // phase is event flow phase: 0(none phase),1(capture phase),2(bubble phase)
            phase:number = 0;
            // 事件类型
            type:number = KeyboardEvent.KEY_DOWN;
            // 事件发送者
            target:any = null;
            altKey:boolean = false;
            ctrlKey:boolean = false;
            shiftKey:boolean = false;
            repeat:boolean = false;
            key:string = "";
            keyCode:number = 0;
            location:number = 0;
            toString():string
            {
                return "[KeyboardEvent]";
            }
        }
    }
}
