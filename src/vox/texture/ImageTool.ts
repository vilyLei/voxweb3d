/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as RendererDevieceT from "../../vox/render/RendererDeviece";
import * as MathConstT from "../../vox/math/MathConst";

import RendererDeviece = RendererDevieceT.vox.render.RendererDeviece;
import MathConst = MathConstT.vox.math.MathConst;

export namespace vox
{
    export namespace texture
    {
        
        function createJpgCanvas(img:any, pw:number,ph:number):any
        {
            var canvas:any = document.createElement('canvas');
            //document.body.appendChild(canvas);
            canvas.width = pw;
            canvas.height = ph;
            //console.log("createImageCanvas(). size: "+canvas.width+","+canvas.height);
            //canvas.style.visibility = "hidden";
            //          canvas.style.backgroundColor = "transparent";
            canvas.style.display = "block";
            canvas.style.left = '0px';
            canvas.style.top = '0px';
            canvas.style.position = 'absolute';
            let ctx2d:any = canvas.getContext("2d");
            ctx2d.drawImage(img, 0, 0, img.width,img.height,0,0,canvas.width,canvas.height);
            return {canvas:canvas,ctx2d:ctx2d};
        }
        function createJpgBytesFromeCanvas(img:any, pw:number,ph:number):any
        {
            var canvas:any = document.createElement('canvas');
            //document.body.appendChild(canvas);
            canvas.width = pw;
            canvas.height = ph;
            //console.log("createImageCanvas(). size: "+canvas.width+","+canvas.height);
            //canvas.style.visibility = "hidden";
            //          canvas.style.backgroundColor = "transparent";
            canvas.style.display = "block";
            canvas.style.left = '0px';
            canvas.style.top = '0px';
            canvas.style.position = 'absolute';
            let ctx2d:any = canvas.getContext("2d");
            ctx2d.drawImage(img, 0, 0, img.width,img.height,0,0,canvas.width,canvas.height);
            return {canvas:canvas,ctx2d:ctx2d,bytes:ctx2d.getImageData(0,0,canvas.width, canvas.height).data};
        }
        export class ImageTool
        {
            static CreateJpgImageMipmaps(srcImg:any):any[]
            {
                let pwidth:number = MathConst.CalcNearestCeilPow2(srcImg.width);                            
                let pheight:number = MathConst.CalcNearestCeilPow2(srcImg.height);
                if(RendererDeviece.IsMobileWeb())
                {
                    if(pwidth > 1024)pwidth = 1024;
                    if(pheight > 1024)pwidth = 1024;
                }
                else
                {
                    if(pwidth > 2048)pwidth = 2048;
                    if(pheight > 2048)pwidth = 2048;
                }
                if(pwidth != srcImg.width || pheight != srcImg.height)
                {
                    srcImg = createJpgCanvas(srcImg, pwidth,pheight).canvas;
                }
                let mipmaps:any[] = [];
                let canvas:any = srcImg;
                while(canvas != null)
                {
                    mipmaps.push(canvas);
                    pwidth = canvas.width;
                    pheight = canvas.height;
                    if(pwidth >= 2 || pheight >= 2)
                    {
                        pwidth = pwidth >= 2 ? ((pwidth / 2) | 0) : 1;
                        pheight = pheight >= 2 ? ((pheight / 2) | 0) : 1;
                        canvas = createJpgCanvas(canvas, pwidth,pheight).canvas;
                    }
                    else
                    {
                        canvas = null;
                    }
                }
                return mipmaps;
            }
            //dobj.ctx2d.getImageData(0,0,dobj.canvas.width, dobj.canvas.height)
            static CreateJpgBytesImg(srcImg:any):Uint8Array
            {
                var canvas:any = document.createElement('canvas');
                canvas.width = srcImg.width;
                canvas.height = srcImg.height;
                canvas.style.display = "block";
                canvas.style.left = '0px';
                canvas.style.top = '0px';
                canvas.style.position = 'absolute';
                let ctx2d:any = canvas.getContext("2d");
                ctx2d.drawImage(srcImg, 0, 0, srcImg.width,srcImg.height,0,0,canvas.width,canvas.height);
                return ctx2d.getImageData(0,0,canvas.width, canvas.height).data as Uint8Array;
            }
            static CreateJpgBytesMipmaps(srcImg:any):any[]
            {
                let pwidth:number = MathConst.CalcNearestCeilPow2(srcImg.width);                            
                let pheight:number = MathConst.CalcNearestCeilPow2(srcImg.height);
                if(RendererDeviece.IsMobileWeb())
                {
                    if(pwidth > 1024)pwidth = 1024;
                    if(pheight > 1024)pwidth = 1024;
                }
                else
                {
                    if(pwidth > 2048)pwidth = 2048;
                    if(pheight > 2048)pwidth = 2048;
                }
                let obj:any = null;
                let canvas:any = null;
                let bytes:Uint8Array;
                if(pwidth != srcImg.width || pheight != srcImg.height)
                {
                    obj = createJpgBytesFromeCanvas(srcImg, pwidth,pheight);
                    canvas = obj.canvas;
                    bytes = obj.bytes;
                }
                else
                {
                    canvas = srcImg;
                    bytes = ImageTool.CreateJpgBytesImg(srcImg);
                }
                let mipmaps:any[] = [];
                while(canvas != null)
                {
                    mipmaps.push({data:bytes,width:canvas.width,height:canvas.height});
                    pwidth = canvas.width;
                    pheight = canvas.height;
                    if(pwidth >= 2 || pheight >= 2)
                    {
                        pwidth = pwidth >= 2 ? ((pwidth / 2) | 0) : 1;
                        pheight = pheight >= 2 ? ((pheight / 2) | 0) : 1;
                        obj = createJpgBytesFromeCanvas(canvas, pwidth,pheight);
                        canvas = obj.canvas;
                        bytes = obj.bytes;
                    }
                    else
                    {
                        canvas = null;
                    }
                }
                return mipmaps;
            }
            
        }
    }
}