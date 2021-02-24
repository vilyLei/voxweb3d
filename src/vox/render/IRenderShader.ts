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
        /**
         * renderer rendering runtime uniform data operations
         */
        export interface IRenderShader
        {
            getActiveAttachmentTotal():number;
            useUniformV1(ult:any,type:number, f32Arr:Float32Array,dataSize:number):void;
            useUniformV2(ult:any,type:number, f32Arr:Float32Array,dataSize:number,offset:number):void;
        }

    }
}
