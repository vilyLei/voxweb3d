/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
export default class VtxBufID
{
    private static s_uid:number = 0;
    static CreateNewID():number
    {
        return VtxBufID.s_uid++;
    }
}