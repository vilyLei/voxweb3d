
/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import KeyboardEvent from "../../vox/event/KeyboardEvent";

class Keyboard {

    static readonly SHIFT = 16;
    static readonly CTRL = 17;
    static readonly ALT = 18;
    static readonly ESC = 27;

    static readonly A = 65;
    static readonly B = 66;
    static readonly C = 67;
    static readonly D = 68;
    static readonly E = 69;
    static readonly F = 70;
    static readonly G = 71;

    static readonly H = 72;
    static readonly I = 73;
    static readonly J = 74;
    static readonly K = 75;
    static readonly L = 76;
    static readonly M = 77;
    static readonly N = 78;

    
    static readonly O = 79;
    static readonly P = 80;
    static readonly Q = 81;
    static readonly R = 82;
    static readonly S = 83;
    static readonly T = 84;

    static readonly U = 85;
    static readonly V = 86;
    static readonly W = 87;
    static readonly X = 88;
    static readonly Y = 89;
    static readonly Z = 90;

    static m_down_ers: any[] = [];
    static m_down_listener: ((target: any, evt: any) => void)[] = [];
    static m_up_ers: any[] = [];
    static m_up_listener: ((target: any, evt: any) => void)[] = [];
    static KeyDown(evt: any): void {
        var len: number = Keyboard.m_down_listener.length;
        //console.log("KeyDown(), m_down_listener.length: ",len);
        for (var i = 0; i < len; ++i) {
            Keyboard.m_down_listener[i].call(Keyboard.m_down_ers[i], evt);
        }
    }
    static KeyUp(evt: any): void {
        let len: number = Keyboard.m_up_listener.length;
        //console.log("KeyUp(), m_up_listener.length: ",len);
        for (let i = 0; i < len; ++i) {
            Keyboard.m_up_listener[i].call(Keyboard.m_up_ers[i], evt);
        }
    }
    static AddEventListener(type: number, target: any, func: (target: any, evt: any) => void): void {
        if (func != null) {
            let i: number = 0;
            switch (type) {
                case KeyboardEvent.KEY_DOWN:
                    for (i = Keyboard.m_down_listener.length - 1; i >= 0; --i) {
                        if (func === Keyboard.m_down_listener[i]) {
                            break;
                        }
                    }
                    if (i < 0) {
                        Keyboard.m_down_ers.push(target);
                        Keyboard.m_down_listener.push(func);
                    }
                    break;
                case KeyboardEvent.KEY_UP:
                    for (i = Keyboard.m_up_listener.length - 1; i >= 0; --i) {
                        if (func === Keyboard.m_up_listener[i]) {
                            break;
                        }
                    }
                    if (i < 0) {
                        Keyboard.m_up_ers.push(target);
                        Keyboard.m_up_listener.push(func);
                    }
                    break;
                default:
                    break;
            }
        }
    }
    static RemoveEventListener(type: number, func: (target: object, evt: object) => void): void {
        if (func != null) {
            let i: number;
            switch (type) {
                case KeyboardEvent.KEY_DOWN:
                    for (i = Keyboard.m_down_listener.length - 1; i >= 0; --i) {
                        if (func === Keyboard.m_down_listener[i]) {
                            Keyboard.m_down_ers.splice(i, 1);
                            Keyboard.m_down_listener.splice(i, 1);
                            break;
                        }
                    }
                    break;
                case KeyboardEvent.KEY_UP:
                    for (i = Keyboard.m_up_listener.length - 1; i >= 0; --i) {
                        if (func === Keyboard.m_up_listener[i]) {
                            Keyboard.m_up_ers.splice(i, 1);
                            Keyboard.m_up_listener.splice(i, 1);
                            break;
                        }
                    }
                    break;
                default:
                    break;
            }
        }
    }
}
export default Keyboard;