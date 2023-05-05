
/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

interface ICoKeyboard {

    readonly SHIFT: number;// = 16;
    readonly CTRL: number;// = 17;
    readonly ALT: number;// = 18;
    readonly ESC: number;// = 27;
    readonly A: number;// = 65;
    readonly B: number;// = 66;
    readonly C: number;// = 67;
    readonly D: number;// = 68;
    readonly E: number;// = 69;
    readonly F: number;// = 70;
    readonly G: number;// = 71;
    readonly H: number;// = 72;
    readonly I: number;// = 73;
    readonly J: number;// = 74;
    readonly K: number;// = 75;
    readonly L: number;// = 76;
    readonly M: number;// = 77;
    readonly N: number;// = 78;    
    readonly O: number;// = 79;
    readonly P: number;// = 80;
    readonly Q: number;// = 81;
    readonly R: number;// = 82;
    readonly S: number;// = 83;
    readonly T: number;// = 84;
    readonly U: number;// = 85;
    readonly V: number;// = 86;
    readonly W: number;// = 87;
    readonly X: number;// = 88;
    readonly Y: number;// = 89;
    readonly Z: number;// = 90;

    KeyDown(evt: any): void;
    KeyUp(evt: any): void;
    AddEventListener(type: number, target: any, func: (target: any, evt: any) => void): void;
    RemoveEventListener(type: number, func: (target: object, evt: object) => void): void;
}
export { ICoKeyboard };