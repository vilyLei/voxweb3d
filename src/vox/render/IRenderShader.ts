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
            getRC():any;
            getActiveAttachmentTotal():number;
            useUniformMat4(ult:any,mat4f32Arr:Float32Array):void;
            useUniformV1(ult:any,type:number, f32Arr:Float32Array,dataSize:number):void;
            useUniformV2(ult:any,type:number, f32Arr:Float32Array,dataSize:number,offset:number):void;
        }

    }
}
