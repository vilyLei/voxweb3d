/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

export default class TextureConst {
    static readonly WRAP_REPEAT: number = 3001;
    static readonly WRAP_CLAMP_TO_EDGE: number = 3002;
    static readonly WRAP_MIRRORED_REPEAT: number = 3003;
    static readonly NEAREST: number = 4001;
    static readonly LINEAR: number = 4002;
    static readonly LINEAR_MIPMAP_LINEAR: number = 4003;
    static readonly NEAREST_MIPMAP_NEAREST: number = 4004;
    static readonly LINEAR_MIPMAP_NEAREST: number = 4005;
    static readonly NEAREST_MIPMAP_LINEAR: number = 4006;
    static GetConst(gl: any, param: number): number {
        switch (param) {
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