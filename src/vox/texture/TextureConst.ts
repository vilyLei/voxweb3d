/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2020 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as RendererDevieceT from "../../vox/render/RendererDeviece";
import RendererDeviece = RendererDevieceT.vox.render.RendererDeviece;

export namespace vox
{
    export namespace texture
    {
        export class TextureFormat
        {
            static R8:number = 101;
            static RGB:number = 110;
            static RED:number = 111;
            static RGBA:number = 121;
            static RGB8:number = 122;
            static RGBA8:number = 123;
            static ALPHA:number = 132;
            static RGB16F:number = 331;
            static RGBA16F:number = 332;
            static RGB32F:number = 341;
            static ToGL(gl:any,format:number):number
            {
                switch(format)
                {
                    case TextureFormat.R8:
                        return gl.R8;
                        break;
                    case TextureFormat.RGB:
                        //console.log("TextureFormat.RGB...");
                        return gl.RGB;
                        break;
                    case TextureFormat.RGB8:
                        return gl.RGB8;
                        break;
                    case TextureFormat.RGBA8:
                        return gl.RGBA8;
                        break;
                    case TextureFormat.ALPHA:
                        return gl.ALPHA;
                        break;
                    case TextureFormat.RGB16F:
                        //console.log("TextureFormat.RGB16F...");
                        if(RendererDeviece.IsWebGL2())
                        {
                            return gl.RGB16F;
                        }
                        return gl.RGB;
                        break;
                    case TextureFormat.RGBA16F:
                        if(RendererDeviece.IsWebGL2())
                        {
                            return gl.RGBA16F;
                        }
                        return gl.RGBA;
                        break;
                    case TextureFormat.RGB32F:
                        //console.log("TextureFormat.RGB32F...");
                        if(RendererDeviece.IsWebGL2()) gl.RGB32F;
                        return gl.RGB;
                        break;
                    case TextureFormat.RED:
                        return gl.RED;
                        break;
                    default:
                    
                }
                return gl.RGBA;
            }
        }
        export class TextureDataType
        {
            static UNSIGNED_BYTE:number = 1109;
            static UNSIGNED_SHORT:number = 1110;
            static BYTE:number = 1111;
            static FLOAT:number = 1211;
            static HALF_FLOAT:number = 1212;
            static HALF_FLOAT_OES:number = 1213;

            static ToGL(gl:any,type:number):number
            {
                switch(type)
                {
                    case TextureDataType.UNSIGNED_BYTE:
                        return gl.UNSIGNED_BYTE;
                        break;
                    case TextureDataType.BYTE:
                        return gl.BYTE;
                        break;
                    case TextureDataType.FLOAT:
                        //console.log("TextureDataType.FLOAT...");
                        return gl.FLOAT;
                        break;
                    case TextureDataType.HALF_FLOAT:
                        return gl.HALF_FLOAT;
                        break;
                    case TextureDataType.HALF_FLOAT_OES:
                        return gl.HALF_FLOAT_OES;
                        break;
                    case TextureDataType.UNSIGNED_SHORT:
                        return gl.UNSIGNED_SHORT;
                        break;
            
                }
                return gl.UNSIGNED_BYTE;
            }
        }

        export class TextureTarget
        {
            static TEXTURE_2D:number = 20;
            static TEXTURE_2D_ARRAY:number = 22;
            static TEXTURE_SHADOW_2D:number = 23;
            static TEXTURE_CUBE:number = 25;
            static TEXTURE_3D:number = 30;
            static GetValue(rc:any,param:number):number
            {
                switch(param)
                {
                    case TextureTarget.TEXTURE_2D:
                    return rc.TEXTURE_2D;
                    break;
                    case TextureTarget.TEXTURE_2D_ARRAY:
                    return rc.TEXTURE_2D_ARRAY;
                    break;
                    case TextureTarget.TEXTURE_CUBE:
                    return rc.TEXTURE_CUBE_MAP;
                    break;
                    case TextureTarget.TEXTURE_3D:
                    return rc.TEXTURE_3D;
                    break;
                    default:
                    break;
                }    
                return rc.TEXTURE_2D;
            }
        }

        export class TextureConst
        {
            static WRAP_REPEAT:number = 3001;
            static WRAP_CLAMP_TO_EDGE:number = 3002;
            static WRAP_MIRRORED_REPEAT:number = 3003;
            static NEAREST:number = 4001;
            static LINEAR:number = 4002;
            static LINEAR_MIPMAP_LINEAR:number = 4003;

            static NEAREST_MIPMAP_NEAREST = 4004;
            static LINEAR_MIPMAP_NEAREST = 4005;
            static NEAREST_MIPMAP_LINEAR = 4006;

            static TEX_PROXY2D:number = 5001;
            static TEX_BYTES2D:number = 5002;
            static TEX_CUBE:number = 5003;
            static TEX_PROXY3D:number = 5004;
            static GetConst(gl:any,param:number):number
            {
                switch(param)
                {
                    case TextureConst.NEAREST:
                    return gl.NEAREST;
                    break;
                    case TextureConst.LINEAR_MIPMAP_LINEAR:
                        console.log("gl.LINEAR_MIPMAP_LINEAR used.");
                    return gl.LINEAR_MIPMAP_LINEAR;
                    break;                    
                    case TextureConst.NEAREST_MIPMAP_NEAREST:
                    return gl.NEAREST_MIPMAP_NEAREST;
                    break;
                    case TextureConst.LINEAR_MIPMAP_NEAREST:
                    return gl.LINEAR_MIPMAP_NEAREST;
                    break;
                    case TextureConst.NEAREST_MIPMAP_LINEAR:
                    return gl.NEAREST_MIPMAP_LINEAR;
                    break;
                    case TextureConst.LINEAR:
                    return gl.LINEAR;
                    break;
                    case TextureConst.WRAP_REPEAT:
                    return gl.REPEAT;
                    break;
                    case TextureConst.WRAP_CLAMP_TO_EDGE:
                    return gl.CLAMP_TO_EDGE;
                    break;
                    case TextureConst.WRAP_MIRRORED_REPEAT:
                    return gl.MIRRORED_REPEAT;
                    break;
                    default:
                    break;
                }
                return -1;
            }
        }
    }
}