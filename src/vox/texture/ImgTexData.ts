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
        export class ImgTexData
        {
            private static s_list:ImgTexData[] = [];
            width:number = 0;
            height:number = 0;
            data:ImageData | HTMLImageElement | HTMLCanvasElement = null;
            miplevel:number = 0;
            status:number = 1;
            offsetx:number = 0;
            offsety:number = 0;
            constructor()
            {
            }
            updateToGpu(gl:any,samplerTarget:number,interType:number,format:number, type:number):void
            {
                if(this.status == 1)
                {
                    gl.texImage2D(samplerTarget, this.miplevel, interType,format, type, this.data);
                }
                else if(this.status == 0)
                {
                    gl.texSubImage2D(samplerTarget, this.miplevel, this.offsetx, this.offsetx, format, type, this.data);
                }
                this.status = -1;
            }
            static Create():ImgTexData
            {
                if(ImgTexData.s_list.length > 0)
                {
                    return ImgTexData.s_list.pop();
                }
                return new ImgTexData();
            }
            static Restore(tsd:ImgTexData):void
            {
                if(tsd != null)
                {
                    tsd.data = null;
                    ImgTexData.s_list.push(tsd);
                }
            }
        }
    }
}