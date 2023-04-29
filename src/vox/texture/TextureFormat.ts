/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import RendererDevice from "../../vox/render/RendererDevice";

export default class TextureFormat {
    static readonly R8: number = 101;
    static readonly R16F: number = 102;
    static readonly R32F: number = 102;
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
		const tf = TextureFormat
        switch (format) {
            case tf.RGBA:
                break;
            case tf.R8:
                return gl.R8;
                break;
            case tf.R16F:
                return gl.R16F;
                break;
            case tf.R32F:
                return gl.R32F;
                break;
            case tf.RGB:
                return gl.RGB;
                break;
            case tf.RGB8:
                return gl.RGB8;
                break;
            case tf.RGBA8:
                return gl.RGBA8;
                break;
            case tf.ALPHA:
                return gl.ALPHA;
                break;
            case tf.RGB16F:
                if (RendererDevice.IsWebGL2()) {
                    return gl.RGB16F;
                }
                return gl.RGB;
                break;
            case tf.RGBA16F:
                if (RendererDevice.IsWebGL2()) {
                    return gl.RGBA16F;
                }
                return gl.RGBA;
                break;
            case tf.RGB32F:
                if (RendererDevice.IsWebGL2()) gl.RGB32F;
                return gl.RGB;
                break;
            case tf.RGBA32F:
                if (RendererDevice.IsWebGL2()) gl.RGBA32F;
                return gl.RGBA;
                break;
            case TextureFormat.RED:
                return gl.RED;
                break;
            case tf.DEPTH_COMPONENT:
                return gl.DEPTH_COMPONENT;
                break;
            case tf.DEPTH_STENCIL:
                return gl.DEPTH_STENCIL;
                break;
            default:
                break;
        }
        return gl.RGBA;
    }
}
