/***************************************************************************/
/*                                                                         */
/*  Copyright 2019-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

export namespace vox
{
    export namespace utils
    {
        export interface IRefCounter
        {
            __$attachThis():void;
            __$detachThis():void;
            getAttachCount():number;
        }
    }
}