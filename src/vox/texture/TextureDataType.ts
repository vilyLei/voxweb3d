/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import RCExtension from "../../vox/render/RCExtension";
export default class TextureDataType {
    static readonly UNSIGNED_BYTE: number = 1108;
    static readonly UNSIGNED_SHORT: number = 1109;
    static readonly UNSIGNED_INT: number = 1110;
    static readonly BYTE: number = 1111;
    static readonly FLOAT: number = 1211;
    static readonly HALF_FLOAT: number = 1212;
    static readonly HALF_FLOAT_OES: number = 1213;
    static readonly UNSIGNED_SHORT_5_6_5: number = 1214;
    static readonly UNSIGNED_SHORT_4_4_4_4: number = 1215;
    static readonly UNSIGNED_SHORT_5_5_5_1: number = 1216;
    static readonly UNSIGNED_INT_24_8_WEBGL: number = 1217;
    static ToGL(gl: any, type: number): number {
        switch (type) {
            case TextureDataType.UNSIGNED_BYTE:
                return gl.UNSIGNED_BYTE;
                break;
            case TextureDataType.BYTE:
                return gl.BYTE;
                break;
            case TextureDataType.FLOAT:
                return gl.FLOAT;
                break;
            case TextureDataType.HALF_FLOAT:
                return gl.HALF_FLOAT;
                break;
            case TextureDataType.HALF_FLOAT_OES:
                if (RCExtension.OES_texture_half_float != null) return RCExtension.OES_texture_half_float.HALF_FLOAT_OES;
                return gl.FLOAT;
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