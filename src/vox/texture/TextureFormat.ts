/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import RendererDevice from "../../vox/render/RendererDevice";

export default class TextureFormat {
    static readonly R8: number = 101;
    static readonly RGB: number = 110;
    static readonly RED: number = 111;
    static readonly RGBA: number = 121;
    static readonly RGB8: number = 122;
    static readonly RGBA8: number = 123;
    static readonly ALPHA: number = 132;
    static readonly RGB16F: number = 331;
    static readonly RGBA16F: number = 332;
    static readonly RGB32F: number = 341;
    static readonly RGBA32F: number = 342;
    static readonly DEPTH_COMPONENT: number = 351;
    static readonly DEPTH_STENCIL: number = 352;
    static ToGL(gl: any, format: number): number {
        switch (format) {
            case TextureFormat.RGBA:
                break;
            case TextureFormat.R8:
                return gl.R8;
                break;
            case TextureFormat.RGB:
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
                if (RendererDevice.IsWebGL2()) {
                    return gl.RGB16F;
                }
                return gl.RGB;
                break;
            case TextureFormat.RGBA16F:
                if (RendererDevice.IsWebGL2()) {
                    return gl.RGBA16F;
                }
                return gl.RGBA;
                break;
            case TextureFormat.RGB32F:
                if (RendererDevice.IsWebGL2()) gl.RGB32F;
                return gl.RGB;
                break;
            case TextureFormat.RGBA32F:
                if (RendererDevice.IsWebGL2()) gl.RGBA32F;
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
