/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2020 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as RendererDevieceT from "../../vox/render/RendererDeviece";
import * as RCExtensionT from "../../vox/render/RCExtension";
import RendererDeviece = RendererDevieceT.vox.render.RendererDeviece;
import RCExtension = RCExtensionT.vox.render.RCExtension;

export namespace vox
{
    export namespace texture
    {
        export class TextureFormat
        {
            static readonly R8:number = 101;
            static readonly RGB:number = 110;
            static readonly RED:number = 111;
            static readonly RGBA:number = 121;
            static readonly RGB8:number = 122;
            static readonly RGBA8:number = 123;
            static readonly ALPHA:number = 132;
            static readonly RGB16F:number = 331;
            static readonly RGBA16F:number = 332;
            static readonly RGB32F:number = 341;
            static readonly RGBA32F:number = 342;
            static readonly DEPTH_COMPONENT:number = 351;
            static readonly DEPTH_STENCIL:number = 352;
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
                    case TextureFormat.RGBA32F:
                        //console.log("TextureFormat.RGB32F...");
                        if(RendererDeviece.IsWebGL2()) gl.RGBA32F;
                        return gl.RGBA;
                    break;
                    case TextureFormat.RED:
                        return gl.RED;
                    break;
                    case TextureFormat.DEPTH_COMPONENT:
                        return gl.DEPTH_COMPONENT;
                    break;
                    case TextureFormat.DEPTH_STENCIL:
                        return gl.DEPTH_STENCIL;
                    break;
                    default:
                    break;
                }
                return gl.RGBA;
            }            
        }
        export class TextureDataType
        {
            static readonly UNSIGNED_BYTE:number = 1108;
            static readonly UNSIGNED_SHORT:number = 1109;
            static readonly UNSIGNED_INT:number = 1110;
            static readonly BYTE:number = 1111;
            static readonly FLOAT:number = 1211;
            static readonly HALF_FLOAT:number = 1212;
            static readonly HALF_FLOAT_OES:number = 1213;

            static readonly UNSIGNED_SHORT_5_6_5:number = 1214;
            static readonly UNSIGNED_SHORT_4_4_4_4:number = 1215;
            static readonly UNSIGNED_SHORT_5_5_5_1:number = 1216;
            static readonly UNSIGNED_INT_24_8_WEBGL:number = 1217;

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
                    case TextureDataType.UNSIGNED_INT:
                        return gl.UNSIGNED_INT;
                    break;
                    case TextureDataType.UNSIGNED_SHORT_5_6_5:
                        return gl.UNSIGNED_SHORT_5_6_5;
                    break;
                    case TextureDataType.UNSIGNED_SHORT_4_4_4_4:
                        return gl.UNSIGNED_SHORT_4_4_4_4;
                    break;
                    case TextureDataType.UNSIGNED_SHORT_5_5_5_1:
                        return gl.UNSIGNED_SHORT_5_5_5_1;
                    break;
                    case TextureDataType.UNSIGNED_INT_24_8_WEBGL:
                        return RCExtension.WEBGL_depth_texture.UNSIGNED_INT_24_8_WEBGL;
                    break;
                    default:
                    break;
            
                }
                return gl.UNSIGNED_BYTE;
            }
        }

        export class TextureTarget
        {
            static readonly TEXTURE_2D:number = 20;
            static readonly TEXTURE_2D_ARRAY:number = 22;
            static readonly TEXTURE_SHADOW_2D:number = 23;
            static readonly TEXTURE_CUBE:number = 25;
            static readonly TEXTURE_3D:number = 30;
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
            static readonly WRAP_REPEAT:number = 3001;
            static readonly WRAP_CLAMP_TO_EDGE:number = 3002;
            static readonly WRAP_MIRRORED_REPEAT:number = 3003;

            static readonly NEAREST:number = 4001;
            static readonly LINEAR:number = 4002;
            static readonly LINEAR_MIPMAP_LINEAR:number = 4003;
            static readonly NEAREST_MIPMAP_NEAREST:number = 4004;
            static readonly LINEAR_MIPMAP_NEAREST:number = 4005;
            static readonly NEAREST_MIPMAP_LINEAR:number = 4006;

            static readonly TEX_PROXY2D:number = 5001;
            static readonly TEX_BYTES2D:number = 5002;
            static readonly TEX_PROXYCUBE:number = 5003;
            static readonly TEX_PROXY3D:number = 5004;
            static GetConst(gl:any,param:number):number
            {
                switch(param)
                {
                    case TextureConst.NEAREST:
                    return gl.NEAREST;
                    break;
                    case TextureConst.LINEAR:
                    return gl.LINEAR;
                    break;
                    case TextureConst.LINEAR_MIPMAP_LINEAR:
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