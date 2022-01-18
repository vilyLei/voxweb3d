/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import { TextureConst, TextureFormat, TextureDataType } from "../../vox/texture/TextureConst";

import { IRTTTexture } from "../../vox/render/texture/IRTTTexture";
import { IDepthTexture } from "../../vox/render/texture/IDepthTexture";
import { IWrapperTexture } from "../../vox/render/texture/IWrapperTexture";

import RTTTextureProxy from "../../vox/texture/RTTTextureProxy";
import DepthTextureProxy from "../../vox/texture/DepthTextureProxy";
import WrapperTextureProxy from "../../vox/texture/WrapperTextureProxy";
import { IRenderProxy } from "../../vox/render/IRenderProxy";
import RendererDevice from "../render/RendererDevice";

/**
 * 本类作为所有RTT纹理对象的管理类
 */
export class RTTTextureStore {
    private m_renderProxy: IRenderProxy = null;
    constructor(renderProxy: IRenderProxy) {
        this.m_renderProxy = renderProxy;
    }
    getRenderProxy(): IRenderProxy {
        return this.m_renderProxy;
    }
    createWrapperTex(pw: number, ph: number, powerof2Boo: boolean = false): IWrapperTexture {
        let tex: WrapperTextureProxy = new WrapperTextureProxy(pw, ph, powerof2Boo);
        return tex;
    }
    createRTTTex2D(pw: number, ph: number, powerof2Boo: boolean = false): IRTTTexture {
        let tex = new RTTTextureProxy(pw, ph, powerof2Boo);
        return tex;
    }
    createDepthTex2D(pw: number, ph: number, powerof2Boo: boolean = false): IDepthTexture {
        let tex: DepthTextureProxy = new DepthTextureProxy(pw, ph, powerof2Boo);
        return tex;
    }
    // reusable rtt texture resources for one renderer context
    private m_rttTexs: IRTTTexture[] = [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null];
    private m_rttCubeTexs: IRTTTexture[] = [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null];
    private m_rttFloatTexs: IRTTTexture[] = [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null];
    private m_rttDepthTexs: IDepthTexture[] = [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null];
    getCubeRTTTextureAt(i: number): IRTTTexture {
        if (this.m_rttCubeTexs[i] != null) {
            this.m_rttCubeTexs[i].__$setRenderProxy(this.m_renderProxy);
            return this.m_rttCubeTexs[i];
        }
        this.m_rttCubeTexs[i] = this.createRTTTex2D(32, 32);
        this.m_rttCubeTexs[i].toCubeTexture();
        this.m_rttCubeTexs[i].name = "sys_cube_rttTex_" + i;
        this.m_rttCubeTexs[i].minFilter = TextureConst.LINEAR;
        this.m_rttCubeTexs[i].magFilter = TextureConst.LINEAR;
        this.m_rttCubeTexs[i].__$setRenderProxy(this.m_renderProxy);
        return this.m_rttCubeTexs[i];
    }
    createCubeRTTTextureAt(i: number, pw: number, ph: number): IRTTTexture {
        pw = pw > 1 ? pw : 1;
        ph = ph > 1 ? ph : 1;
        if (this.m_rttCubeTexs[i] != null) {
            this.m_rttCubeTexs[i].__$setRenderProxy(this.m_renderProxy);
            return this.m_rttCubeTexs[i];
        }
        this.m_rttCubeTexs[i] = this.createRTTTex2D(pw, ph);
        this.m_rttCubeTexs[i].toCubeTexture();
        this.m_rttCubeTexs[i].name = "sys_cube_rttTex_" + i;
        this.m_rttCubeTexs[i].minFilter = TextureConst.LINEAR;
        this.m_rttCubeTexs[i].magFilter = TextureConst.LINEAR;
        this.m_rttCubeTexs[i].__$setRenderProxy(this.m_renderProxy);
        return this.m_rttCubeTexs[i];
    }
    getRTTTextureAt(i: number): IRTTTexture {
        if (this.m_rttTexs[i] != null) {
            this.m_rttTexs[i].__$setRenderProxy(this.m_renderProxy);
            return this.m_rttTexs[i] as IRTTTexture;
        }
        this.m_rttTexs[i] = this.createRTTTex2D(32, 32);
        this.m_rttTexs[i].to2DTexture();
        this.m_rttTexs[i].name = "sys_rttTex_" + i;
        this.m_rttTexs[i].minFilter = TextureConst.LINEAR;
        this.m_rttTexs[i].magFilter = TextureConst.LINEAR;
        this.m_rttTexs[i].__$setRenderProxy(this.m_renderProxy);
        return this.m_rttTexs[i];
    }
    createRTTTextureAt(i: number, pw: number, ph: number): IRTTTexture {
        pw = pw > 1 ? pw : 1;
        ph = ph > 1 ? ph : 1;
        if (this.m_rttTexs[i] != null) {
            this.m_rttTexs[i].__$setRenderProxy(this.m_renderProxy);
            return this.m_rttTexs[i];
        }
        this.m_rttTexs[i] = this.createRTTTex2D(pw, ph);
        this.m_rttTexs[i].to2DTexture();
        this.m_rttTexs[i].name = "sys_rttTex_" + i;
        this.m_rttTexs[i].minFilter = TextureConst.LINEAR;
        this.m_rttTexs[i].magFilter = TextureConst.LINEAR;
        this.m_rttTexs[i].__$setRenderProxy(this.m_renderProxy);
        return this.m_rttTexs[i];
    }
    getDepthTextureAt(i: number): IDepthTexture {
        if (this.m_rttDepthTexs[i] != null) {
            this.m_rttDepthTexs[i].__$setRenderProxy(this.m_renderProxy);
            return this.m_rttDepthTexs[i];
        }
        this.m_rttDepthTexs[i] = this.createDepthTex2D(64, 64);
        this.m_rttDepthTexs[i].to2DTexture();
        this.m_rttDepthTexs[i].name = "sys_depthTex_" + i;
        this.m_rttDepthTexs[i].minFilter = TextureConst.NEAREST;
        this.m_rttDepthTexs[i].magFilter = TextureConst.NEAREST;
        this.m_rttDepthTexs[i].__$setRenderProxy(this.m_renderProxy);
        return this.m_rttDepthTexs[i];
    }
    createDepthTextureAt(i: number, pw: number, ph: number): IDepthTexture {
        pw = pw > 1 ? pw : 1;
        ph = ph > 1 ? ph : 1;
        if (this.m_rttDepthTexs[i] != null) {
            this.m_rttDepthTexs[i].__$setRenderProxy(this.m_renderProxy);
            return this.m_rttDepthTexs[i];
        }
        this.m_rttDepthTexs[i] = this.createDepthTex2D(pw, ph);
        this.m_rttDepthTexs[i].to2DTexture();
        this.m_rttDepthTexs[i].name = "sys_depthTex_" + i;
        this.m_rttDepthTexs[i].__$setRenderProxy(this.m_renderProxy);
        return this.m_rttDepthTexs[i];
    }
    getRTTFloatTextureAt(i: number): IRTTTexture {
        if (this.m_rttFloatTexs[i] != null) {
            this.m_rttFloatTexs[i].__$setRenderProxy(this.m_renderProxy);
            return this.m_rttFloatTexs[i];
        }
        let tex = this.createRTTTex2D(64, 64);
        tex.to2DTexture();
        this.m_rttFloatTexs[i] = tex;
        this.m_rttFloatTexs[i].name = "sys_rttFloatTex_" + i;
        tex.internalFormat = TextureFormat.RGBA16F;
        tex.srcFormat = TextureFormat.RGBA;
        tex.dataType = TextureDataType.FLOAT;
        tex.minFilter = TextureConst.NEAREST;
        tex.magFilter = TextureConst.NEAREST;

        if (RendererDevice.IsWebGL1()) {
            tex.dataType = TextureDataType.HALF_FLOAT_OES;
        }

        this.m_rttFloatTexs[i].__$setRenderProxy(this.m_renderProxy);
        return tex;
    }
    createRTTFloatTextureAt(i: number, pw: number, ph: number): IRTTTexture {
        pw = pw > 1 ? pw : 1;
        ph = ph > 1 ? ph : 1;
        if (this.m_rttFloatTexs[i] != null) {
            this.m_rttFloatTexs[i].__$setRenderProxy(this.m_renderProxy);
            return this.m_rttFloatTexs[i];
        }
        let tex = this.createRTTTex2D(pw, ph);
        tex.to2DTexture();
        this.m_rttFloatTexs[i] = tex;
        this.m_rttFloatTexs[i].name = "sys_rttFloatTex_" + i;
        tex.internalFormat = TextureFormat.RGBA16F;
        tex.srcFormat = TextureFormat.RGBA;
        tex.dataType = TextureDataType.FLOAT;
        tex.minFilter = TextureConst.NEAREST;
        tex.magFilter = TextureConst.NEAREST;
        if (RendererDevice.IsWebGL1()) {
            tex.dataType = TextureDataType.HALF_FLOAT_OES;
        }
        this.m_rttFloatTexs[i].__$setRenderProxy(this.m_renderProxy);
        return tex;
    }
}

export default RTTTextureStore;