
/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as KeyboardEventT from "../../vox/event/KeyboardEvent";

import KeyboardEvent = KeyboardEventT.vox.event.KeyboardEvent;

export namespace vox
{
    export namespace ui
    {
        export class Keyboard
        {
            
            static m_down_ers:any[] = [];
            static m_down_listener:((target:any,evt:any)=>void)[] = [];
            static m_up_ers:any[] = [];
            static m_up_listener:((target:any,evt:any)=>void)[] = [];

            static KeyDown(evt:any):void
            {
                var len:number = Keyboard.m_down_listener.length;
                //console.log("KeyDown(), m_down_listener.length: ",len);
                for(var i = 0; i < len; ++i)
                {
                    Keyboard.m_down_listener[i].call(Keyboard.m_down_ers[i],evt);
                }
            }
            static KeyUp(evt:any):void
            {
                let len:number = Keyboard.m_up_listener.length;
                //console.log("KeyUp(), m_up_listener.length: ",len);
                for(let i = 0; i < len; ++i)
                {
                    Keyboard.m_up_listener[i].call(Keyboard.m_up_ers[i],evt);
                }
            }
            static AddEventListener = function(type:number,target:any,func:(target:any,evt:any)=>void)
            {
                if(func != null)
                {
                    let i:number = 0;
                    switch(type)
                    {
                        case KeyboardEvent.KEY_DOWN:
                            for(i = Keyboard.m_down_listener.length - 1; i >= 0; --i)
                            {
                                if(func === Keyboard.m_down_listener[i])
                                {
                                    break;
                                }
                            }
                            if(i < 0)
                            {
                                Keyboard.m_down_ers.push(target);
                                Keyboard.m_down_listener.push(func);
                            }
                        break;
                        case KeyboardEvent.KEY_UP:
                            for(i = Keyboard.m_up_listener.length - 1; i >= 0; --i)
                            {
                                if(func === Keyboard.m_up_listener[i])
                                {
                                    break;
                                }
                            }
                            if(i < 0)
                            {
                                Keyboard.m_up_ers.push(target);
                                Keyboard.m_up_listener.push(func);
                            }
                        break;               
                        default:
                        break;
                    }
                }
            };
            static RemoveEventListener(type:number,func:(target:object,evt:object)=>void):void
            {
                if(func != null)
                {
                    let i:number;
                    switch(type)
                    {
                        case KeyboardEvent.KEY_DOWN:
                            for(i = Keyboard.m_down_listener.length - 1; i >= 0; --i)
                            {
                                if(func === Keyboard.m_down_listener[i])
                                {
                                    Keyboard.m_down_ers.splice(i,1);
                                    Keyboard.m_down_listener.splice(i,1);
                                    break;
                                }
                            }
                        break;
                        case KeyboardEvent.KEY_UP:
                            for(i = Keyboard.m_up_listener.length - 1; i >= 0; --i)
                            {
                                if(func === Keyboard.m_up_listener[i])
                                {
                                    Keyboard.m_up_ers.splice(i,1);
                                    Keyboard.m_up_listener.splice(i,1);
                                    break;
                                }
                            }
                        break;                
                        default:
                        break;
                    }
                }
            };
        }
    }
}