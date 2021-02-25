/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

export namespace vox
{
    export namespace render
    {
        export interface IRenderResource
        {
            /**
             * real renderer gpu context
             */
            getRC():any;
            getRCUid():number;
            hasResUid(resUid:number):boolean;
            /**
            * @param resUid 准备 bind 到 当前 renderer context 的 gpu texture buffer
            */
            bindToGpu(resUid:number):void;
        }
    }
}