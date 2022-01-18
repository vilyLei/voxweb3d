/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IRenderResource from '../../vox/render/IRenderResource';
import RenderProxy from "../../vox/render/RenderProxy"
import IRenderTexture from "../../vox/render/texture/IRenderTexture"
import IRenderBuffer from "../../vox/render/IRenderBuffer";
import ROBufferUpdater from "../../vox/render/ROBufferUpdater";

class TextureResSlot {
    private m_texResource: IRenderResource = null;
    private m_bufferUpdater: ROBufferUpdater = null;
    private m_textureTotal: number = 0;
    private m_textureMap: Map<number, IRenderTexture> = new Map();
    private m_freeMap: Map<number, number> = new Map();

    private static s_ins: TextureResSlot = null;
    private m_texUid: number = 0;
    private m_freeUids: number[] = [];
    constructor() {
        if (TextureResSlot.s_ins != null) {
            throw Error("This Class is a singleton class!!!");
        }
        TextureResSlot.s_ins = null;
    }
    static GetInstance(): TextureResSlot {
        if (TextureResSlot.s_ins != null) {
            return TextureResSlot.s_ins;
        }
        TextureResSlot.s_ins = new TextureResSlot();
        return TextureResSlot.s_ins;
    }
    getFreeUid(): number {
        if (this.m_freeUids.length > 0) {
            return this.m_freeUids.pop();
        }
        let uid: number = this.m_texUid++;
        return uid;
    }
    /**
     * 将texture实例添加到统一管理的 TextureResSlot中
     * 这个函数不允许其他地方调用
     */
    __$$addTexture(texture: IRenderTexture): void {
        if (texture != null && !this.m_textureMap.has(texture.getUid())) {
            this.m_textureMap.set(texture.getUid(), texture);
            this.m_textureTotal++;
        }
    }
    getTextureByUid(uid: number): IRenderTexture {
        return this.m_textureMap.get(uid);
    }
    hasTextureByUid(uid: number): boolean {
        return this.m_textureMap.has(uid);
    }
    removeTextureByUid(uid: number): IRenderTexture {
        if (this.m_textureMap.has(uid)) {
            let tex: IRenderTexture = this.m_textureMap.get(uid);
            if (tex.getAttachCount() < 1) {
                if (this.m_freeMap.has(uid)) {
                    this.m_freeMap.delete(uid);
                }
                tex.__$destroy();
                tex.__$$removeFromSlot();
                this.m_textureMap.delete(uid);
                this.m_freeUids.push(uid);
                this.m_textureTotal--;
                return tex;
            }
        }
        return null;
    }
    /**
     * @returns get runtime all textures amount
     */
    getTextureTotal(): number {
        return this.m_textureTotal;
    }
    setRenderProxy(renderProxy: RenderProxy): void {
        this.m_texResource = renderProxy.Texture;
    }
    setBufferUpdater(bufferUpdater: ROBufferUpdater): void {
        this.m_bufferUpdater = bufferUpdater;
    }
    getFreeResUidMap(): Map<number, number> {
        return this.m_freeMap;
    }
    isGpuEnabledByResUid(resUid: number): boolean {
        return this.m_texResource.hasResUid(resUid);
    }
    // 先使用map hash拦截的方式,来决定buf和renderer context避免重复的单次关联
    addRenderBuffer(buf: IRenderBuffer, bufResUid: number): void {
        if (this.m_bufferUpdater != null) {
            this.m_bufferUpdater.__$addBuf(buf, bufResUid);
        }
    }
    addFreeUid(uid: number): void {
        this.m_freeMap.set(uid, 0);
    }
    removeFreeUid(uid: number): void {
        if (this.m_freeMap.has(uid)) {
            this.m_freeMap.delete(uid);
        }
    }
}
export default TextureResSlot;