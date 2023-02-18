/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import { TextureProxyType } from "../../vox/texture/TextureProxyType";
import TextureConst from "../../vox/texture/TextureConst";
import TextureFormat from "../../vox/texture/TextureFormat";
import TextureDataType from "../../vox/texture/TextureDataType";

import Color4 from "../../vox/material/Color4";
import IRunnable from "../../vox/base/IRunnable";

import IRenderTexture from "../../vox/render/texture/IRenderTexture";
import { IRTTTexture } from "../../vox/render/texture/IRTTTexture";
import { IDepthTexture } from "../../vox/render/texture/IDepthTexture";
import { IWrapperTexture } from "../../vox/render/texture/IWrapperTexture";
import { IFloatCubeTexture } from "../../vox/render/texture/IFloatCubeTexture";
import { IBytesCubeTexture } from "../../vox/render/texture/IBytesCubeTexture";
import { IImageTexture } from "../../vox/render/texture/IImageTexture";
import { IImageCubeTexture } from "../../vox/render/texture/IImageCubeTexture";
import { ITexture3D } from "../../vox/render/texture/ITexture3D";
import { IBytesTexture } from "../../vox/render/texture/IBytesTexture";
import { IFloatTexture } from "../../vox/render/texture/IFloatTexture";
import { IUint16Texture } from "../../vox/render/texture/IUint16Texture";

import TexturePool from "../../vox/texture/TexturePool";
import ImageTextureProxy from "../../vox/texture/ImageTextureProxy";
import BytesTextureProxy from "../../vox/texture/BytesTextureProxy";
import Uint16TextureProxy from "../../vox/texture/Uint16TextureProxy";
import FloatTextureProxy from "../../vox/texture/FloatTextureProxy";
import FloatCubeTextureProxy from "../../vox/texture/FloatCubeTextureProxy";
import BytesCubeTextureProxy from "../../vox/texture/BytesCubeTextureProxy";
import ImageCubeTextureProxy from "../../vox/texture/ImageCubeTextureProxy";
import Texture3DProxy from "../../vox/texture/Texture3DProxy";

import IRenderProxy from "../../vox/render/IRenderProxy";
import TextureResSlot from "../../vox/texture/TextureResSlot";
import { RTTTextureStore } from "../../vox/texture/RTTTextureStore";
import { ITextureBlock } from "./ITextureBlock";

/**
 * 本类作为所有基础纹理对象的管理类,只允许在RendererInstance之上的类中使用
 */
class TextureBlock implements ITextureBlock {
    private m_texPool: TexturePool = new TexturePool();
    private m_rttStore: RTTTextureStore = null;
    private m_renderProxy: IRenderProxy = null;
    private m_texLoaders: IRunnable[] = [];
    addTexLoader(texLoader: IRunnable): void {
        if (texLoader != null) {
            let i: number = 0;
            let il: number = this.m_texLoaders.length
            for (; i < il; ++i) {
                if (texLoader == this.m_texLoaders[i]) {
                    break;
                }
            }
            if (i >= il) {
                this.m_texLoaders.push(texLoader);
            }
        }
    }
    removeTexLoader(texLoader: IRunnable): void {
        if (texLoader != null) {
            let i: number = 0;
            let il: number = this.m_texLoaders.length
            for (; i < il; ++i) {
                if (texLoader == this.m_texLoaders[i]) {
                    this.m_texLoaders.slice(i, 1);
                    break;
                }
            }
        }
    }
    /**
     * 设置当前的渲染器代理
     * @param renderProxy 当前的渲染器代理
     */
    setRenderer(renderProxy: IRenderProxy): void {
        this.m_renderProxy = renderProxy;
        TextureResSlot.GetInstance().setRenderProxy(renderProxy);
        if (this.m_rttStore == null && renderProxy != null) {
            this.m_rttStore = new RTTTextureStore(renderProxy);
        }
    }
    getRTTStrore(): RTTTextureStore {
        return this.m_rttStore;
    }
    createWrapperTex(pw: number, ph: number, powerof2Boo: boolean = false): IWrapperTexture {
        return this.m_rttStore.createWrapperTex(pw, ph, powerof2Boo);
    }
    createRTTTex2D(pw: number, ph: number, powerof2Boo: boolean = false): IRTTTexture {
        let tex: IRTTTexture = this.m_rttStore.createRTTTex2D(pw, ph, powerof2Boo);
        tex.__$setRenderProxy(this.m_renderProxy);
        return tex;
    }
    createImageTex2D(w: number = 64, h: number = 64, powerof2Boo: boolean = false): IImageTexture {
        let tex = this.m_texPool.getTexture(TextureProxyType.Image) as ImageTextureProxy;
        if (tex == null) {
            tex = new ImageTextureProxy(w, h, powerof2Boo);
        }
        tex.__$setRenderProxy(this.m_renderProxy);
        tex.mipmapEnabled = true;
        tex.setWrap(TextureConst.WRAP_REPEAT);
        return tex;
    }

    createHalfFloatTex2D(pw: number, ph: number, powerof2Boo: boolean = false): IFloatTexture {
        let tex = this.m_texPool.getTexture(TextureProxyType.Float) as FloatTextureProxy;
        if (tex == null) {
            tex = new FloatTextureProxy(pw, ph, powerof2Boo);
        }
        tex.__$setRenderProxy(this.m_renderProxy);
        tex.srcFormat = TextureFormat.RGBA;
        tex.dataType = TextureDataType.HALF_FLOAT_OES;
        //tex.srcFormat = TextureFormat.RGBA16F;
        //tex.dataType = TextureDataType.FLOAT;
        return tex;
    }
    createFloatTex2D(pw: number, ph: number, powerof2Boo: boolean = false): IFloatTexture {
        let tex = this.m_texPool.getTexture(TextureProxyType.Float) as FloatTextureProxy;
        if (tex == null) {
            tex = new FloatTextureProxy(pw, ph, powerof2Boo);
        }
        tex.__$setRenderProxy(this.m_renderProxy);
        return tex;
    }
    createUint16Tex2D(pw: number, ph: number, powerof2Boo: boolean = false): IUint16Texture {
        return new Uint16TextureProxy(pw, ph, powerof2Boo);
    }
    createFloatCubeTex(pw: number, ph: number, powerof2Boo: boolean = false): IFloatCubeTexture {
        return new FloatCubeTextureProxy(pw, ph);
    }
    createBytesTex(w: number, h: number): IBytesTexture {
        let tex = this.m_texPool.getTexture(TextureProxyType.Bytes) as BytesTextureProxy;
        if (tex == null) {
            tex = new BytesTextureProxy(w, h);
        }
        tex.__$setRenderProxy(this.m_renderProxy);
        return tex;
    }

    createBytesCubeTex(w: number, h: number): IBytesCubeTexture {
        let tex = new BytesCubeTextureProxy(w, h);
        tex.__$setRenderProxy(this.m_renderProxy);
        return tex;
    }
    createImageCubeTex(w: number = 64, h: number = 64): IImageCubeTexture {
        let tex = new ImageCubeTextureProxy(w, h);
        tex.__$setRenderProxy(this.m_renderProxy);
        return tex;
    }
    createTex3D(w: number, h: number, depth: number = 1): ITexture3D {
        if (depth < 1) {
            depth = 1;
        }
        let tex = new Texture3DProxy(w, h, depth);
        tex.__$setRenderProxy(this.m_renderProxy);
        return tex;
    }
    createRGBATex2D(pw: number, ph: number, color: Color4): IBytesTexture {
        pw = pw > 1 ? pw : 1;
        ph = ph > 1 ? ph : 1;
        let tot = pw * ph;
        let tex = this.createBytesTex(pw, ph);
        let bytes: Uint8Array = new Uint8Array(tot * 4);
        let pr = Math.round(color.r * 255.0);
        let pg = Math.round(color.g * 255.0);
        let pb = Math.round(color.b * 255.0);
        let pa = Math.round(color.a * 255.0);
        let k = 0;
        let fs: number[] = [pr, pg, pb, pa];
        for (let i = 0; i < tot; ++i) {
            bytes.set(fs, k);
            k += 4;
        }
        tex.setDataFromBytes(bytes, 0, pw, ph, 0, 0, false);
        tex.__$setRenderProxy(this.m_renderProxy);
        return tex;
    }
    createAlphaTex2D(pw: number, ph: number, alpha: number): IBytesTexture {
        pw = pw > 1 ? pw : 1;
        ph = ph > 1 ? ph : 1;
        let size: number = pw * ph;
        let tex = this.createBytesTex(pw, ph);
        tex.toAlphaFormat();
        let bytes: Uint8Array = new Uint8Array(size);
        let value: number = Math.round(alpha * 255.0);
        bytes.fill(value, 0, size);
        tex.setDataFromBytes(bytes, 0, pw, ph, 0, 0, false);
        tex.__$setRenderProxy(this.m_renderProxy);
        return tex;
    }
    createAlphaTexBytes2D(pw: number, ph: number, bytes: Uint8Array): IBytesTexture {
        let tex = this.createBytesTex(pw, ph);
        tex.setDataFromBytes(bytes, 0, pw, ph, 0, 0, false);
        tex.toAlphaFormat();
        tex.__$setRenderProxy(this.m_renderProxy);
        return tex;
    }

    /**
     * get a system cube rtt texture
     * @param i rtt texture index in the system
     */
    getCubeRTTTextureAt(i: number): IRTTTexture {
        return this.m_rttStore.getCubeRTTTextureAt(i);
    }
    createCubeRTTTextureAt(i: number, pw: number, ph: number): IRTTTexture {
        return this.m_rttStore.createCubeRTTTextureAt(i, pw, ph);
    }
    getRTTTextureAt(i: number): IRTTTexture {
        return this.m_rttStore.getRTTTextureAt(i);
    }
    createRTTTextureAt(i: number, pw: number, ph: number): IRTTTexture {
        return this.m_rttStore.createRTTTextureAt(i, pw, ph);
    }
    getDepthTextureAt(i: number): IDepthTexture {
        return this.m_rttStore.getDepthTextureAt(i);
    }
    createDepthTextureAt(i: number, pw: number, ph: number): IDepthTexture {
        return this.m_rttStore.createDepthTextureAt(i, pw, ph);
    }
    getRTTFloatTextureAt(i: number): IRTTTexture {
        return this.m_rttStore.getRTTFloatTextureAt(i);
    }
    createRTTFloatTextureAt(i: number, pw: number, ph: number): IRTTTexture {
        return this.m_rttStore.createRTTFloatTextureAt(i, pw, ph);
    }
    private m_clearDelay: number = 128;
    run(): void {
        let i: number = 0;
        let il: number = this.m_texLoaders.length;
        for (; i < il; ++i) {
            this.m_texLoaders[i].run();
        }
        if (this.m_clearDelay < 1) {
            /**
             * 准备释放回收 texture resource.
             */
            let tex: IRenderTexture;
            this.m_clearDelay = 128;

            let freeMap: Map<number, number> = TextureResSlot.GetInstance().getFreeResUidMap();
            let total: number = 32;
            for (const [key, value] of freeMap) {
                if (total < 1) {
                    break;
                }
                total--;
                if (value > 2) {
                    freeMap.delete(key);
                    tex = TextureResSlot.GetInstance().removeTextureByUid(key);
                    if (tex != null) {
                        this.m_texPool.addTexture(tex);
                    }
                    else {
                        console.warn("TextureBlock remove a texture(uid=" + key + ") error.");
                    }
                    console.log("TextureBlock remove a texture: ", tex);
                }
                else {
                    freeMap.set(key, value + 1);
                }
            }
        }
        this.m_clearDelay--;
    }

}
export { TextureBlock }