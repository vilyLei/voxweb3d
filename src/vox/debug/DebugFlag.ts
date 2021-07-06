/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/


export default class DebugFlag
{
    constructor(){}
    
    static Flag_0: number = 0x0;

    static Reset(): void {

        DebugFlag.Flag_0 = 0x0;
    }
}