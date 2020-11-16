/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

export namespace vox
{
    export namespace mesh
    {
        export class VtxBufID
        {
            private static __s_uid:number = 0;
            static CreateNewID():number
            {
                return VtxBufID.__s_uid++;
            }
        }
    }
}