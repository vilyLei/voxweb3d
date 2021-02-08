/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

export namespace vox
{
    export namespace texture
    {
        export interface ITexData
        {
            // 0表示 更新纹理数据而不会重新开辟空间, 1表示需要重新开辟空间并更新纹理数据, -1表示不需要更新
            status:number;
            updateToGpu(gl:any,samplerTarget:number,interType:number,format:number, type:number):void;
        }
    }
}