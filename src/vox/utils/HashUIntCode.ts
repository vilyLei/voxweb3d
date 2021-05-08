/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
export default class HashUIntCode
{
    static __code:number = 31;
    static Reset():void
    {
        HashUIntCode.__code = 31;
    }
    static AddUint(uintV:number):void
    {
        HashUIntCode.__code = HashUIntCode.__code * 131 + uintV;
    }

    static GetCode(target:number,bit:number):number
    {
        return HashUIntCode.__code;
    }
}