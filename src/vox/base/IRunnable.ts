/***************************************************************************/
/*                                                                         */
/*  Copyright 2019-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

export namespace vox
{
    export namespace base
    {
        export interface IRunnable
        {
            setRunFlag(flag:number):void;
            getRunFlag():number;
            isRunning():boolean;
            isStopped():boolean;
            run():void;
        }
    }
}